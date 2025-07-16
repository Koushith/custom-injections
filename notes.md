# Custom JavaScript Guide for Reclaim SDK

## Overview

When the verification flow initiates with InApp SDKs (Reclaim Verifier/AppClip), a webview launches. Upon downloading the Reclaim provider config, the InApp SDK constructs and injects a JavaScript code snippet into every webpage during load time.

## Global Objects

The following Reclaim-specific objects are added to the window object for SDK interaction:

```typescript
// Available window objects
window.payloadData; // Provider configuration
window.reclaimInterceptor; // Request/Response middleware
window.flutter_inappwebview; // SDK communication bridge

// PayloadData Interface
export interface PayloadData {
  name: string | null;
  description: string | null;
  loginUrl: string | null;
  userAgent: UserAgentSettings;
  geoLocation: string | null;
  providerHash: string | null;
  additionalClientOptions: string | null;
  useIncognitoWebview: boolean | null;
  requestData: HttpClaimRequest[];
  parameters: WitnessParameters[];
}
```

## Interceptor Types

Available injection types for the devtool and InApp SDK:

- **HAWKEYE** (default)
- **MSWJS**
- **XHOOK** (deprecated)
- **NONE** (no interception)

### HAWKEYE Interceptor

```typescript
// Request middleware
window.reclaimInterceptor.addRequestMiddleware(async (request) => {
  console.log('Request:', request.url);
});

// Response middleware
window.reclaimInterceptor.addResponseMiddleware(async (response, request) => {
  console.log('Response:', response.body);
});
```

### MSWJS Interceptor

```typescript
window.reclaimInterceptor.on('response', async ({ requestId, response }) => {
  console.log('Request ID:', requestId);
  console.log('Response:', response);
});
```

## Data Extraction Tips

- Log requests and responses to access method, URL, headers, body, etc.
- Use DOM manipulation to extract data from HTML responses
- Parse JSON responses directly
- Reference examples in the `custom-js` folder

## Proof Generation Format

```typescript
const requestData = {
  url: '', // Endpoint URL from interceptor
  headers: { ...response.headers },
  method: 'GET',
  requestBody: '', // Empty for GET requests
  responseBody: 'response', // Use actual response for POST requests
  extractedParams: {
    bankId: 1234, // Values from response parsing
  },
  geoLocation: window.payloadData.geoLocation,
  responseMatches: [
    {
      type: 'contains',
      invert: false,
      value: '{{bankId}}', // Match extractedParams key
    },
  ],
  responseRedactions: [
    {
      regex: '{{bankId}}', // Match extractedParams key
    },
  ],
  witnessParameters: { ...window.payloadData.parameters },
};
```

## Triggering Proof Generation

```typescript
window.flutter_inappwebview.callHandler('extractedData', JSON.stringify(requestData));
```

## Verification Review Behavior

- Appears when webpage loading begins
- Hides after 1-2 seconds if user login interaction is required
- Persists during redirects within the 1-2 second window
- Reappears for claim creation, errors, or proof generation events
- Auto-hides after 10-20 seconds of inactivity

## Troubleshooting

### Website Compatibility Issues

If a website works in the default browser but not with Reclaim InApp SDK:

1. Try platform-specific user agents
2. Set `disableRequestReplay` to `true`
3. Disable injections by setting type to `NONE`
   - Requires manual claim requests using `window.Reclaim.requestClaim`

### Recommended User Agents

**Android:**

```
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36
```

**iOS/iPadOS:**

```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```

```

> Note: Additional user agents for different devices and platforms can be found online. The above examples work for most common scenarios.

```

```

```
