/**
 * Singapore Airlines - name, email, phone number, address
 * Injection Type: None
 * Injection Type: None
 */

if (window.location.href === 'https://www.singaporeair.com/krisflyer/account-summary/elite') {
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

      const data = await fetch('https://www.singaporeair.com/home/dwLoggedInUserData.form', {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          priority: 'u=1, i',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        referrer: 'https://www.singaporeair.com/krisflyer/account-summary/elite',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      });

      const json = await data.json();
      console.log(json);

      // proof trigger
      const requestData = {
        url: 'https://www.singaporeair.com/home/dwLoggedInUserData.form',
        cookies: '',
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          priority: 'u=1, i',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          referrer: 'https://www.singaporeair.com/krisflyer/account-summary/elite',
          referrerPolicy: 'strict-origin-when-cross-origin',
          mode: 'cors',
          credentials: 'include',
        },
        method: 'GET',
        requestBody: '',
        responseBody: 'response',
        extractedParams: {
          firstName: json.firstName,
          lastName: json.lastName,
          userId: json.kfNumber,
          ffpMiles: json.ffpMiles,
          currentTier: json.currentTier,
          userType: json.userType,
        },
        geoLocation: window.payloadData.geoLocation,
        responseRedactions: [
          {
            jsonPath: '',
            regex: 'firstName":(?<firstName>.*)', // greedy
            xPath: null,
          },
          {
            jsonPath: '',
            regex: 'lastName":(?<lastName>.*)',
            xPath: null,
          },
          { jsonPath: '', regex: 'kfNumber":(?<userId>.*)', xPath: null },
          {
            jsonPath: '',
            regex: 'ffpMiles":(?<ffpMiles>.*)',
            xPath: null,
          },
          {
            jsonPath: '',
            regex: 'currentTier":(?<currentTier>.*)',
            xPath: null,
          },
          { jsonPath: '', regex: 'userType":(?<userType>.*)', xPath: null },
        ],
        responseMatches: [
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
            value: '{{userId}}',
          },
          {
            type: 'contains',
            value: '{{ffpMiles}}',
          },
          {
            type: 'contains',
            value: '{{currentTier}}',
          },
          {
            type: 'contains',
            value: '{{userType}}',
          },
        ],
        witnessParameters: { ...window.payloadData.parameters },
      };

      if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.flutter_inappwebview.callHandler('extractedData', JSON.stringify(requestData)); // witness call/ attestor
        window.injected = true;
      }
    } catch (e) {
      console.error('Injection error:', e);
    }
  }, 1000);
}
