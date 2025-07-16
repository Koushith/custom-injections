/**
 * Emirates Skywards
 * Injection Type: None
 * providerID:776524f8-a2db-4db9-96a4-66541a7c5c8b
 * description: hitting the direct endpoint and constructing the regex
 *
 *
 */
if (window.location.href.includes('/skywards/account/my-overview/')) {
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

      const url = window.location.href;

      const data = await fetch(url, {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'en-US,en;q=0.9',
          priority: 'u=0, i',
          'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'upgrade-insecure-requests': '1',
        },
        referrer: 'https://www.emirates.com/us/english/skywards/account/my-overview/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      });

      const html = await data.text();
      const regex =
        /"(firstName|lastName|emailAddress|personId|title|phoneNumber|customerType|countryOfResidence|dateOfBirth|joiningDate)"\s*:\s*"?(.*?)"?[,}]/g;
      let match;
      const result = {};
      while ((match = regex.exec(html)) !== null) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
      }
      const rd = {
        url: url,
        cookies: '',
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'en-US,en;q=0.9',
          priority: 'u=0, i',
          'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'upgrade-insecure-requests': '1',
          referrer: url,
          referrerPolicy: 'strict-origin-when-cross-origin',
        },
        method: 'GET',
        requestBody: '',
        responseBody: 'response',
        extractedParams: {
          firstName: result.firstName,
          lastName: result.lastName,
          emailAddress: result.emailAddress,
          userId: result.personId,
          phoneNumber: result.phoneNumber,
          dateOfBirth: result.dateOfBirth,
          joiningDate: result.joiningDate,
        },
        responseVariables: [
          'firstName',
          'lastName',
          'emailAddress',
          'userId',
          'phoneNumber',
          'dateOfBirth',
          'joiningDate',
        ],
        geoLocation: window.payloadData.geoLocation,
        responseMatches: [
          {
            invert: false,
            type: 'regex',
            value: 'firstName":"(?<firstName>[^"]*)"',
          },
          {
            invert: false,
            type: 'regex',
            value: 'lastName":"(?<lastName>[^"]*)"',
          },
          {
            invert: false,
            type: 'regex',
            value: 'emailAddress":"(?<emailAddress>[^"]*)"',
          },
          {
            invert: false,
            type: 'regex',
            value: 'personId":(?<userId>.*?),',
          },
          {
            invert: false,
            type: 'regex',
            value: 'phoneNumber":"(?<phoneNumber>[^"]*)"',
          },
          {
            invert: false,
            type: 'regex',
            value: 'dateOfBirth":"(?<dateOfBirth>[^"]*)"',
          },
          {
            invert: false,
            type: 'regex',
            value: 'joiningDate":"(?<joiningDate>[^"]*)"',
          },
        ],
        responseRedactions: [
          { jsonPath: '', regex: 'firstName":"(?<firstName>[^"]*)"' },
          { jsonPath: '', regex: 'lastName":"(?<lastName>[^"]*)"' },
          { jsonPath: '', regex: 'emailAddress":"(?<emailAddress>[^"]*)"' },
          { jsonPath: '', regex: 'personId":(?<userId>.*?),' },
          { jsonPath: '', regex: 'phoneNumber":"(?<phoneNumber>[^"]*)"' },
          { jsonPath: '', regex: 'dateOfBirth":"(?<dateOfBirth>[^"]*)"' },
          { jsonPath: '', regex: 'joiningDate":"(?<joiningDate>[^"]*)"' },
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
