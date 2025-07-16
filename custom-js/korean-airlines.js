/**
 * Korean Airlines - get account id, firstName, lastName and email
 * Injection Type: None
 * Provider: 9db43368-548d-4f40-8656-29c3798f45bf
 */

if (window.location.href === 'https://www.koreanair.com/') {
  setInterval(async () => {
    try {
      // Check if provider data exists
      if (!window.payloadData) {
        return;
      }

      // Check if already injected
      if (window.injected) {
        return;
      }

      const data = await fetch('https://www.koreanair.com/api/li/auth/loginUserInfo', {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          appversion: 'exists',
          channel: 'pc',
        },
        referrer: 'https://www.koreanair.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      });

      const result = await data.json();

      const rd = {
        url: 'https://www.koreanair.com/api/li/auth/loginUserInfo',
        cookies: '',
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          appversion: 'exists',
          channel: 'pc',
          referrer: 'https://www.koreanair.com/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          mode: 'cors',
          credentials: 'include',
        },
        method: 'GET',
        requestBody: '',
        responseBody: 'response',
        extractedParams: {
          userId: result.skypassNumber?.toString(),
          email: result.email?.toString(),
          firstName: result.englishFirstName?.toString(),
          lastName: result.englishLastName?.toString(),
          createdAt: result.enrollmentDate?.toString(),
        },
        responseVariables: ['userId', 'email', 'firstName', 'lastName', 'createdAt'],
        geoLocation: window.payloadData.geoLocation,
        responseRedactions: [
          {
            jsonPath: '',
            regex: '{{userId}}',
          },
          {
            jsonPath: '',
            regex: '{{email}}',
          },
          {
            jsonPath: '',
            regex: '{{firstName}}',
          },
          {
            jsonPath: '',
            regex: '{{lastName}}',
          },
          {
            jsonPath: '',
            regex: '{{createdAt}}',
          },
        ],
        responseMatches: [
          {
            type: 'contains',
            value: '{{userId}}',
          },
          {
            type: 'contains',
            value: '{{email}}',
          },
          {
            type: 'contains',
            value: '{{firstName}}',
          },
          {
            type: 'contains',
            value: '{{lastName}}',
          },
          {
            type: 'contains',
            value: '{{createdAt}}',
          },
        ],
        witnessParameters: { ...window.payloadData.parameters },
      };

      if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.flutter_inappwebview.callHandler('extractedData', JSON.stringify(rd));
        window.injected = true;
      }
    } catch (e) {
      console.error('Injection error:', e);
    }
  }, 1000);
}
