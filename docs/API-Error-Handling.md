# API Error Handling Documentation

## Overview
This document details all error scenarios handled by the `/api/llm` endpoint and how they're managed.

## Error Flow

```
Client Request → Validation → OpenAI Call → Response
     ↓              ↓              ↓           ↓
   Error?        Error?         Error?     Success
```

## Error Categories

### 1. Validation Errors (400 Bad Request)

**Trigger**: Invalid client input  
**Status Code**: `400`  
**Handled By**: API route validation layer

#### Scenarios:

| Error | Trigger | Response |
|-------|---------|----------|
| Empty prompt | `prompt: ""` or `prompt: "   "` | `"Prompt is required and must be a non-empty string"` |
| Prompt too long | `prompt.length > 1000` | `"Prompt must be 1000 characters or less"` |
| Invalid length | `length: "tiny"` | `"Length must be 'short', 'medium', or 'long'"` |
| Invalid vibe | `vibe: "happy"` | `"Vibe must be 'upbeat', 'chill', or 'mystic'"` |
| Invalid format | `format: "rap"` | `"Format must be 'song' or 'poem'"` |

**Example Response**:
```json
{
  "error": "Prompt is required and must be a non-empty string"
}
```

---

### 2. Configuration Errors (503 Service Unavailable)

**Trigger**: OpenAI API not properly configured  
**Status Code**: `503`  
**Handled By**: `lib/openai.ts` validation

#### Scenarios:

| Error | Trigger | Response |
|-------|---------|----------|
| Missing API key | `OPENAI_API_KEY` not set | `"OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local"` |
| Placeholder key | `OPENAI_API_KEY=your_openai_api_key_here` | `"Please replace the placeholder API key in .env.local with your actual OpenAI API key"` |
| Invalid API key | Wrong/expired key | `"API authentication failed. Please check your API key configuration."` |
| Quota exceeded | No credits in OpenAI account | `"API access denied. Please check your OpenAI account status and billing."` |

**Example Response**:
```json
{
  "error": "OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local"
}
```

**Resolution**: Configure `.env.local` with valid API key

---

### 3. Rate Limit Errors (429 Too Many Requests)

**Trigger**: OpenAI rate limits exceeded  
**Status Code**: `429`  
**Handled By**: `lib/llm-service.ts` error handling

#### Scenarios:

| Rate Limit Type | Trigger | Resolution |
|----------------|---------|------------|
| Requests per minute | Too many requests in short time | Wait 60 seconds |
| Tokens per minute | Exceeded token quota | Wait 60 seconds |
| Daily quota | Hit daily limit | Wait until next day or upgrade plan |

**Response**:
```json
{
  "error": "Too many requests. Please wait a moment and try again."
}
```

**Resolution**: 
- Wait and retry
- Implement client-side rate limiting
- Upgrade OpenAI account tier

---

### 4. Timeout Errors (504 Gateway Timeout)

**Trigger**: Request takes longer than 30 seconds  
**Status Code**: `504`  
**Handled By**: `lib/llm-service.ts` timeout handling

**Response**:
```json
{
  "error": "Request timed out. Please try again."
}
```

**Causes**:
- OpenAI API overloaded
- Network latency
- Complex prompt processing

**Resolution**: Retry the request

---

### 5. API Errors (500 Internal Server Error)

**Trigger**: Various API/network issues  
**Status Code**: `500`  
**Handled By**: `lib/llm-service.ts` error handling

#### Scenarios:

| Error Type | OpenAI Status | User Message |
|------------|---------------|--------------|
| Invalid request | 400 | `"Invalid request. Please try a different prompt."` |
| Server error | 500, 502, 503 | `"OpenAI service is temporarily unavailable. Please try again in a moment."` |
| Network error | ENOTFOUND, ECONNREFUSED | `"Network error. Please check your internet connection."` |
| Invalid response | Empty/null response | `"Failed to generate verse. Please try again."` |
| Generic error | Unknown | `"Failed to generate verse. Please try again."` |

**Example Response**:
```json
{
  "error": "OpenAI service is temporarily unavailable. Please try again in a moment."
}
```

---

## Error Response Format

All errors follow a consistent format:

```typescript
{
  error: string;  // Human-readable error message
}
```

**HTTP Status Codes Used**:
- `400` - Bad Request (validation errors)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error (general API errors)
- `503` - Service Unavailable (configuration errors)
- `504` - Gateway Timeout (timeout errors)

---

## Client-Side Error Handling

### In PromptCard.tsx

```typescript
try {
  const response = await fetch("/api/llm", { ... });
  
  if (!response.ok) {
    throw new Error("Failed to generate content");
  }
  
  const data = await response.json();
  setResult(data.verse);
} catch (err) {
  setError(err.message);
}
```

### Display to User

All errors are displayed in a user-friendly error card:

```tsx
{error && (
  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    {error}
  </div>
)}
```

---

## Testing Error Scenarios

### 1. Test Configuration Error
```bash
# Remove API key temporarily
mv .env.local .env.local.backup

# Start server and try to generate
npm run dev

# Expected: "OpenAI API key is not configured"
```

### 2. Test Validation Errors
```bash
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "", "length": "short", "vibe": "upbeat", "format": "song"}'

# Expected: 400 with validation error
```

### 3. Test Invalid Length
```bash
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "length": "huge", "vibe": "upbeat", "format": "song"}'

# Expected: 400 "Length must be 'short', 'medium', or 'long'"
```

### 4. Test Rate Limiting
```bash
# Send many requests rapidly
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/llm \
    -H "Content-Type: application/json" \
    -d '{"prompt": "test", "length": "short", "vibe": "upbeat", "format": "song"}'
done

# Expected: Eventually receive 429 errors
```

---

## Monitoring & Logging

### Server-Side Logging

All errors are logged to console:

```typescript
console.error("Error in LLM API route:", error);
console.error("OpenAI API Error:", error);
```

### Recommended Monitoring

1. **Track error rates** by status code
2. **Monitor 429 errors** for rate limit issues
3. **Monitor 503 errors** for configuration problems
4. **Track average response time** to detect slowdowns
5. **Alert on sustained 500 errors** for OpenAI outages

### Production Logging Setup

For production, consider adding:
- Error tracking service (e.g., Sentry)
- Request ID tracking
- User ID tracking (when auth is added)
- Detailed error context
- Performance metrics

---

## Error Recovery Strategies

### For Users:
1. **Validation errors**: Fix input and retry
2. **Rate limit errors**: Wait and retry (automatic backoff recommended)
3. **Timeout errors**: Retry immediately
4. **API errors**: Retry after a moment
5. **Config errors**: Contact support

### For Developers:
1. **Check OpenAI status**: https://status.openai.com
2. **Verify API key**: Check `.env.local` configuration
3. **Check billing**: Ensure OpenAI account has credits
4. **Review logs**: Check console for detailed errors
5. **Test manually**: Use curl to isolate issues

---

## Future Enhancements

### Potential Improvements:
- [ ] Implement exponential backoff for retries
- [ ] Add request deduplication
- [ ] Cache successful responses
- [ ] Add circuit breaker pattern for OpenAI outages
- [ ] Implement fallback to mock data when OpenAI unavailable
- [ ] Add request queueing for rate limit management
- [ ] Implement user-level rate limiting
- [ ] Add detailed error codes for client-side handling
- [ ] Add retry-after headers for rate limits
- [ ] Implement graceful degradation

---

## Support Resources

- **OpenAI Status**: https://status.openai.com
- **OpenAI Documentation**: https://platform.openai.com/docs
- **Rate Limits**: https://platform.openai.com/account/rate-limits
- **Usage Dashboard**: https://platform.openai.com/usage
- **Billing**: https://platform.openai.com/account/billing

