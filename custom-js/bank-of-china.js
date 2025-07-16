setInterval(() => {
  if (window.location.href === 'https://its.bochk.com/acm.overview.do') {
    const isAlreadyInjected = window.sessionStorage.getItem('injected');
    if (isAlreadyInjected) {
      return;
    }

    window.reclaimInterceptor.addResponseMiddleware(async (response, request) => {
      if (response.url.includes('https://its.bochk.com/acm.overview.do')) {
        window.sessionStorage.setItem('injected', 'true');

        const htmlSnippet = response.body;
        const timeMatch = htmlSnippet.match(/currentTime\s*=\s*'([^']+)'/);
        const currentTime = timeMatch ? timeMatch[1] : null;
        console.log('currentTime:', currentTime);

        alert(currentTime);

        // ---------- 2) helper to grab the value in the *next* <td> after a label ----------
        function escapeRegex(str) {
          return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape special chars
        }

        function valueAfterLabel(html, label) {
          const pattern = new RegExp(`<td[^>]*>${escapeRegex(label)}<\\/td>\\s*<td[^>]*>:\\s*([^<]+)`, 'i');
          const m = html.match(pattern);
          return m ? m[1].trim() : null;
        }

        // ---------- 3) pull each field ----------
        const bankIdLabel = '14位網上/電話銀行號碼';
        const customerLabel = '「自在理財」客戶號碼';
        const userLabel = '用戶名稱';

        console.log('Bank ID:', valueAfterLabel(htmlSnippet, bankIdLabel));
        console.log('Customer ID:', valueAfterLabel(htmlSnippet, customerLabel));
        console.log('Username:', valueAfterLabel(htmlSnippet, userLabel));

        alert(
          JSON.stringify({
            bankId: valueAfterLabel(htmlSnippet, bankIdLabel),
            customerId: valueAfterLabel(htmlSnippet, customerLabel),
            username: valueAfterLabel(htmlSnippet, userLabel),
          })
        );

        const rd = {
          url: response.url,
          headers: { ...response.headers },
          method: 'GET',
          requestBody: '',
          responseBody: 'response',
          extractedParams: {
            bankId: valueAfterLabel(htmlSnippet, bankIdLabel),
            customerId: valueAfterLabel(htmlSnippet, customerLabel),
            username: valueAfterLabel(htmlSnippet, userLabel),
            currentTime: currentTime?.toString(),
          },
          geoLocation: window.payloadData.geoLocation,
          responseMatches: [
            {
              type: 'contains',
              invert: false,
              value: '{{bankId}}',
            },
            {
              type: 'contains',
              invert: false,
              value: '{{customerId}}',
            },
            {
              type: 'contains',
              invert: false,
              value: '{{username}}',
            },
            {
              type: 'contains',
              invert: false,
              value: '{{currentTime}}',
            },
          ],
          responseRedactions: [
            {
              regex: '{{bankId}}',
            },
            {
              regex: '{{customerId}}',
            },
            {
              regex: '{{username}}',
            },
            {
              regex: '{{currentTime}}',
            },
          ],
          witnessParameters: { ...window.payloadData.parameters },
        };
        window.injected = true;
        window.flutter_inappwebview.callHandler('extractedData', JSON.stringify(rd));
      }
    });
  }
}, 1000);
