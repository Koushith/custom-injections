Android UA:
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36

#Injection types

- HAWKEYE
- MSJWC

# Injection type is HAWKEYE use below method to intercept the request

```
/**
 * Expose the interceptor instance globally
 * This allows adding more middlewares from other scripts or the console
 *
 * This is for HAWAKEYE
 *
 * Usage examples:
 *
 * // Add a request middleware
 * window.reclaimInterceptor.addRequestMiddleware(async (request) => {
 *   console.log('New request:', request.url);
 * });
 *
 * // Add a response middleware
 * window.reclaimInterceptor.addResponseMiddleware(async (response, request) => {
 *   console.log('New response:', response.body);
 * });
 */

```

# Injection type is MSJW use below method to intercept the request

```
 window.reclaimInterceptor.on('response', async ({ requestId, response }) => {

    console.log('requestId', requestId);
    console.log('response', response);

 })
```
