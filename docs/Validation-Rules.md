# NeuroSong API Validation Rules

## Overview
This document defines all input validation rules for the `/api/llm` endpoint. These rules ensure data integrity and prevent invalid requests from reaching the LLM processing layer.

## Validation Rules by Parameter

### 1. Prompt Text
**Parameter**: `prompt`  
**Type**: `string`  
**Required**: Yes

#### Rules:
- Must be a non-null, non-undefined value
- Must be of type `string`
- Must be non-empty after trimming whitespace
- Must be 1000 characters or less after trimming
- Automatically trimmed before processing

#### Valid Examples:
```json
{
  "prompt": "How does neuroplasticity work?"
}
```
```json
{
  "prompt": "Tell me about synapses and neurons"
}
```
```json
{
  "prompt": "  Explain Hebbian learning  " // Trimmed to "Explain Hebbian learning"
}
```

#### Invalid Examples:
```json
{
  "prompt": "" // Empty string
}
```
```json
{
  "prompt": "   " // Only whitespace
}
```
```json
{
  "prompt": null // Null value
}
```
```json
{
  // Missing prompt field
}
```
```json
{
  "prompt": 12345 // Not a string
}
```
```json
{
  "prompt": "Very long text..." // > 1000 characters
}
```

#### Error Messages:
- `"Prompt is required and must be a non-empty string"` - Status 400
- `"Prompt must be 1000 characters or less"` - Status 400

---

### 2. Length Parameter
**Parameter**: `length`  
**Type**: `"short" | "medium" | "long"`  
**Required**: Yes

#### Rules:
- Must be exactly one of: `"short"`, `"medium"`, or `"long"`
- Case-sensitive (lowercase only)
- Controls verse output length:
  - `"short"` = 4 lines
  - `"medium"` = 8 lines
  - `"long"` = 12 lines

#### Valid Examples:
```json
{
  "length": "short"
}
```
```json
{
  "length": "medium"
}
```
```json
{
  "length": "long"
}
```

#### Invalid Examples:
```json
{
  "length": "tiny" // Not in allowed values
}
```
```json
{
  "length": "LONG" // Wrong case
}
```
```json
{
  "length": "" // Empty string
}
```
```json
{
  // Missing length field
}
```
```json
{
  "length": 1 // Not a string
}
```

#### Error Messages:
- `"Length must be 'short', 'medium', or 'long'"` - Status 400

---

### 3. Vibe Parameter
**Parameter**: `vibe`  
**Type**: `"upbeat" | "chill" | "mystic"`  
**Required**: Yes

#### Rules:
- Must be exactly one of: `"upbeat"`, `"chill"`, or `"mystic"`
- Case-sensitive (lowercase only)
- Controls verse tone and style:
  - `"upbeat"` = Energetic, enthusiastic tone
  - `"chill"` = Calm, relaxed, mellow tone
  - `"mystic"` = Mystical, ethereal tone

#### Valid Examples:
```json
{
  "vibe": "upbeat"
}
```
```json
{
  "vibe": "chill"
}
```
```json
{
  "vibe": "mystic"
}
```

#### Invalid Examples:
```json
{
  "vibe": "happy" // Not in allowed values
}
```
```json
{
  "vibe": "Upbeat" // Wrong case
}
```
```json
{
  "vibe": "" // Empty string
}
```
```json
{
  // Missing vibe field
}
```
```json
{
  "vibe": ["upbeat"] // Not a string
}
```

#### Error Messages:
- `"Vibe must be 'upbeat', 'chill', or 'mystic'"` - Status 400

---

### 4. Format Parameter
**Parameter**: `format`  
**Type**: `"song" | "poem"`  
**Required**: Yes

#### Rules:
- Must be exactly one of: `"song"` or `"poem"`
- Case-sensitive (lowercase only)
- Controls verse structure:
  - `"song"` = Musical, rhythmic structure
  - `"poem"` = Poetic structure

#### Valid Examples:
```json
{
  "format": "song"
}
```
```json
{
  "format": "poem"
}
```

#### Invalid Examples:
```json
{
  "format": "rap" // Not in allowed values
}
```
```json
{
  "format": "SONG" // Wrong case
}
```
```json
{
  "format": "" // Empty string
}
```
```json
{
  // Missing format field
}
```
```json
{
  "format": true // Not a string
}
```

#### Error Messages:
- `"Format must be 'song' or 'poem'"` - Status 400

---

## Complete Valid Request Example

```json
{
  "prompt": "Explain how synapses strengthen with practice",
  "length": "medium",
  "vibe": "upbeat",
  "format": "song"
}
```

**Expected Response** (200):
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

---

## Complete Invalid Request Examples

### Example 1: Missing Required Field
```json
{
  "prompt": "How does the brain learn?",
  "length": "short",
  "vibe": "upbeat"
  // Missing "format"
}
```
**Error Response** (400):
```json
{
  "error": "Format must be 'song' or 'poem'"
}
```

### Example 2: Invalid Enum Value
```json
{
  "prompt": "Tell me about neurons",
  "length": "huge",
  "vibe": "upbeat",
  "format": "song"
}
```
**Error Response** (400):
```json
{
  "error": "Length must be 'short', 'medium', or 'long'"
}
```

### Example 3: Empty Prompt
```json
{
  "prompt": "   ",
  "length": "medium",
  "vibe": "chill",
  "format": "poem"
}
```
**Error Response** (400):
```json
{
  "error": "Prompt is required and must be a non-empty string"
}
```

### Example 4: Prompt Too Long
```json
{
  "prompt": "Very long text exceeding 1000 characters...",
  "length": "long",
  "vibe": "mystic",
  "format": "poem"
}
```
**Error Response** (400):
```json
{
  "error": "Prompt must be 1000 characters or less"
}
```

---

## Error Handling

### Validation Errors (400 Bad Request)
All validation failures return HTTP 400 with a descriptive error message in the format:
```json
{
  "error": "Specific error message"
}
```

### Server Errors (500 Internal Server Error)
Unexpected server errors return HTTP 500 with:
```json
{
  "error": "Internal server error"
}
```

---

## Test Coverage Summary

### Prompt Validation Tests
- ✅ Valid: Normal text prompt
- ✅ Valid: Prompt with whitespace (trimmed)
- ✅ Valid: Prompt at max length (1000 chars)
- ❌ Invalid: Empty string
- ❌ Invalid: Only whitespace
- ❌ Invalid: Null/undefined
- ❌ Invalid: Non-string type
- ❌ Invalid: Over 1000 characters

### Length Validation Tests
- ✅ Valid: "short"
- ✅ Valid: "medium"
- ✅ Valid: "long"
- ❌ Invalid: Other string values
- ❌ Invalid: Wrong case
- ❌ Invalid: Empty string
- ❌ Invalid: Non-string type

### Vibe Validation Tests
- ✅ Valid: "upbeat"
- ✅ Valid: "chill"
- ✅ Valid: "mystic"
- ❌ Invalid: Other string values
- ❌ Invalid: Wrong case
- ❌ Invalid: Empty string
- ❌ Invalid: Non-string type

### Format Validation Tests
- ✅ Valid: "song"
- ✅ Valid: "poem"
- ❌ Invalid: Other string values
- ❌ Invalid: Wrong case
- ❌ Invalid: Empty string
- ❌ Invalid: Non-string type

### Integration Tests
- ✅ Valid: Complete valid request
- ❌ Invalid: Missing required fields
- ❌ Invalid: Multiple validation failures
- ✅ Valid: Extra fields ignored (gracefully handled)

---

## Implementation Location
All validation logic is implemented in:
- **File**: `/app/api/llm/route.ts`
- **Function**: `POST` handler (lines 10-63)

---

## Change Log
- **2024-12-08**: Initial validation rules documentation created
  - Documented all 4 parameter validation rules
  - Added prompt length limit (1000 chars)
  - Enhanced error messages for clarity
  - Added comprehensive examples for valid/invalid cases

