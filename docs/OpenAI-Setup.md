# OpenAI Integration Setup Guide

## Overview
This guide explains how to set up OpenAI integration for the NeuroSong Learning Tool.

## Prerequisites
- OpenAI API account
- API key from https://platform.openai.com/api-keys

## Installation

### 1. Install Dependencies
```bash
npm install
```

This will install the OpenAI SDK (v4.67.0) along with other dependencies.

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-api-key-here

# Model Configuration (optional - these are the defaults)
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=300
OPENAI_TEMPERATURE=0.8
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 3. Get Your API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-` or `sk-`)
5. Paste it into your `.env.local` file

## Configuration Options

### OPENAI_API_KEY (Required)
Your OpenAI API key. Get it from https://platform.openai.com/api-keys

### OPENAI_MODEL (Optional)
Default: `gpt-4o-mini`

**Available Models:**
- `gpt-4o-mini` (Recommended) - Fast, cost-effective, good quality
  - Cost: ~$0.000150 per verse
  - Speed: 2-3 seconds
  - Best for: MVP, development, high volume

- `gpt-4o` - More creative, higher quality
  - Cost: ~$0.0015 per verse (10x more expensive)
  - Speed: 3-5 seconds
  - Best for: Production, premium features

- `gpt-3.5-turbo` - Fastest, cheapest
  - Cost: ~$0.000100 per verse
  - Speed: 1-2 seconds
  - Best for: High volume, budget constraints

### OPENAI_MAX_TOKENS (Optional)
Default: `300`

Maximum tokens for the response. A typical verse uses 150-250 tokens.
- Short verses: ~100-150 tokens
- Medium verses: ~150-200 tokens
- Long verses: ~200-300 tokens

Increase if you get truncated responses. Decrease to save costs.

### OPENAI_TEMPERATURE (Optional)
Default: `0.8`

Controls creativity/randomness (0.0 to 2.0):
- `0.7` - More consistent, focused
- `0.8` - Balanced (recommended)
- `0.9-1.0` - More creative, varied
- `1.1+` - Very creative, less predictable

## Cost Estimates

### Using gpt-4o-mini (recommended):
- **Development**: ~$0.50/month (100 requests)
- **Light usage**: ~$4.50/month (1,000 requests)
- **Moderate usage**: ~$45/month (10,000 requests)
- **Heavy usage**: ~$450/month (100,000 requests)

### Tips to Reduce Costs:
1. Use `gpt-4o-mini` for MVP and development
2. Cache popular verses (future enhancement)
3. Implement rate limiting per user
4. Monitor usage in OpenAI dashboard
5. Set billing alerts in OpenAI account

## Testing the Integration

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test the API Endpoint

Using curl:
```bash
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How does neuroplasticity work?",
    "length": "medium",
    "vibe": "upbeat",
    "format": "song"
  }'
```

### 3. Expected Response
```json
{
  "verse": "Neurons firing, connections growing strong!\nSynapses dancing all day long!\n...",
  "metadata": {
    "vibe": "upbeat",
    "format": "song",
    "length": "medium"
  }
}
```

## Troubleshooting

### Error: "API key not found"
- Check that `.env.local` exists in project root
- Verify `OPENAI_API_KEY` is set correctly
- Restart the development server after adding env vars

### Error: "Invalid API key"
- Verify the key starts with `sk-`
- Check for extra spaces or quotes in `.env.local`
- Generate a new key if the old one was deleted

### Error: "Rate limit exceeded"
- You've hit OpenAI's rate limits
- Wait a few minutes and try again
- Upgrade your OpenAI account tier if needed
- Check https://platform.openai.com/account/rate-limits

### Error: "Insufficient quota"
- Your OpenAI account has no credits
- Add billing information at https://platform.openai.com/account/billing
- Check your usage at https://platform.openai.com/usage

### Response is truncated
- Increase `OPENAI_MAX_TOKENS` in `.env.local`
- Recommended: 300-400 for long verses
- Restart server after changing

### Responses are too similar
- Increase `OPENAI_TEMPERATURE` (try 0.9-1.0)
- Each request should still be unique due to the user prompt

### Responses are too random/off-topic
- Decrease `OPENAI_TEMPERATURE` (try 0.6-0.7)
- Check that the prompt template is working correctly

## Monitoring Usage

### OpenAI Dashboard
- View usage: https://platform.openai.com/usage
- Set spending limits: https://platform.openai.com/account/billing/limits
- View API logs: https://platform.openai.com/account/api-keys

### Recommended Monitoring:
1. Set a monthly spending limit in OpenAI dashboard
2. Enable email alerts for 80% and 100% of limit
3. Monitor daily costs during initial launch
4. Track requests per user to detect abuse

## Security Best Practices

### ✅ Do:
- Keep API key in `.env.local` only
- Never commit `.env.local` to git
- Use `.env.example` as a template (without real key)
- Keep API key server-side only (Next.js API routes)
- Rotate API keys periodically
- Set spending limits in OpenAI account

### ❌ Don't:
- Never expose API key to client-side code
- Never commit API key to version control
- Never share API key in chat, email, or screenshots
- Never hardcode API key in source files

## Development vs Production

### Development Setup:
```bash
# .env.local
OPENAI_API_KEY=sk-proj-dev-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=300
OPENAI_TEMPERATURE=0.8
```

### Production Setup:
```bash
# .env.production (or environment variables in hosting platform)
OPENAI_API_KEY=sk-proj-prod-key
OPENAI_MODEL=gpt-4o-mini  # or gpt-4o for higher quality
OPENAI_MAX_TOKENS=300
OPENAI_TEMPERATURE=0.8
```

## Next Steps

After setup:
1. ✅ Install dependencies (`npm install`)
2. ✅ Create `.env.local` with your API key
3. ✅ Start dev server (`npm run dev`)
4. ✅ Test the integration
5. ✅ Monitor costs in OpenAI dashboard
6. 🔄 Implement actual OpenAI integration (Task 3)

## Support

- OpenAI Documentation: https://platform.openai.com/docs
- OpenAI Help Center: https://help.openai.com
- OpenAI Community: https://community.openai.com
- NeuroSong Issues: [Link to your issue tracker]

