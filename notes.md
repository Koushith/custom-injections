### Guide on how to write a custom js

# Flow

As soon as the verification flow starts with InApp SDKs (Reclaim Verifier /AppClip), a webview is started. When Reclaim provider config is downloaded, the InApp sdk(used by the reclaim verifier app) builds a javascript code snippet from provider js injection. This javascript code is injected in every webpage page and runs when page loading starts.

To intercat with inapp sdks, few of the reclaim specifc objects are added to the window obejct.
few of them are:

```js
window.payloadData; // contains the provider config
window.reclaimInterceptor; // middleware to intercept the request and response
window.flutter_inappwebview; // to send messages to and from the inapp sdk
```

```ts
//payload
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

# There are few methods/middlewares that can be used to intercept the request and response before that lets us see the types of interceptors we have:

# Injection types avaliable on the devtool and being used by inappsdk (verifier app)

- HAWKEYE - default
- MSWJS
- XHOOK - deprocated- not used anymore
- NONE - no interceptor

depending on the injection type, we can use different methods to intercept the request and response.

# Injection type is HAWKEYE use below method to intercept the request

```js
/**
 * Expose the interceptor instance globally
 * This allows adding more middlewares from other scripts or the console
 *
 * This is for HAWAKEYE
 *
 * Usage examples:
 *
 *
 * */
// Add a request middleware
window.reclaimInterceptor.addRequestMiddleware(async (request) => {
  console.log('request', request);
  console.log('New request:', request.url);
});

// Add a response middleware
window.reclaimInterceptor.addResponseMiddleware(async (response, request) => {
  console.log('New response:', response.body);
});
```

# Injection type is MSWJS use below method to intercept the request

```js
window.reclaimInterceptor.on('response', async ({ requestId, response }) => {
  console.log('requestId', requestId);
  console.log('response', response);
});
```

Tip : if you log the request and response - you will have all the information you need to extract the data.

it can be method, url, headers, body, etc.

now you can do a dom manipulation to extract the data you need.
if the response is a json, you can parse it and extract the data you need.

if the response is a html, you can use a dom parser to extract the data you need.

refere the examples attached in the custom-js folder.

once you have the data, you can trigger the proof. our attostor accepts the data in the following format:

```js
const rd = {
  url: '', // url of the endpoint -> you can grab it from the interceptor eg: request.url
  headers: { ...response.headers },
  method: 'GET',
  requestBody: '', // since it is a get request, we don't have a request body
  responseBody: 'response', // keep it as response. boilerplate stuff. if it is a post request, you can grab the body from the interceptor eg: response.body
  extractedParams: {
    bankId: 1234, // values you get after parsing the response./ dom manipulation etc
  },
  geoLocation: window.payloadData.geoLocation,
  responseMatches: [
    {
      type: 'contains',
      invert: false,
      value: '{{bankId}}', // match the extractedParams key
    },
  ],
  responseRedactions: [
    {
      regex: '{{bankId}}', // match the extractedParams key
    },
  ],
  witnessParameters: { ...window.payloadData.parameters }, //boilerplate stuff.
};
```

# Final step after grabbing all values - To trigger the proof

```js
window.flutter_inappwebview.callHandler('extractedData', JSON.stringify(rd));
```

# Commonly used User Agents

Android UA:
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36

# FAQ

### Q. How long is this verification review shown and when?

By default, it starts showing when web page loading starts. Hides when inapp sdk detects if the page requires user interaction for login after 1-2 seconds of page loading completion. If a redirection happens to another page between this 1-2 secs, then verification review banner is not hidden and still shown. Its shown again on events like claim creation, error or proof generation changes like completion happens. When nothing happens for 10-20 seconds, the verification review is removed and the webview screen becomes visible.
