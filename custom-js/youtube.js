/**
 * Youtube analytics
 * Injection Type: MSJW
 */

(function () {
  const channelPagePattern = 'https://studio.youtube.com/channel/';
  const analyticsPath = '/analytics/tab-earn_revenue/';
  const storageKey = 'ytStudioNavigation_timestamp';
  const navigatedFlagKey = 'ytStudioNavigation_completed';

  function shouldNavigate() {
    if (window.location.href.includes(analyticsPath)) return false;

    const lastNavigationTime = localStorage.getItem(storageKey);
    const navigatedFlag = localStorage.getItem(navigatedFlagKey);
    const currentTime = Date.now();

    if (lastNavigationTime && navigatedFlag === 'true') {
      const timeSinceLastNavigation = currentTime - parseInt(lastNavigationTime);
      if (timeSinceLastNavigation < 30000) return false;
    }
    return true;
  }

  function processAndNavigate() {
    if (window.location.href.startsWith(channelPagePattern) && !window.location.href.includes(analyticsPath)) {
      if (!shouldNavigate()) return false;

      const urlPath = window.location.pathname;
      const channelIdMatch = urlPath.match(/\/channel\/([^\/]+)/);
      if (channelIdMatch && channelIdMatch[1]) {
        const channelId = channelIdMatch[1];
        const analyticsUrl = `https://studio.youtube.com/channel/${channelId}/analytics/tab-earn_revenue/period-year/explore?entity_type=CHANNEL&entity_id=${channelId}&time_period=year&explore_type=TABLE_AND_CHART&metric=VIDEO_COUNT_FIRST_PUBLISHED&granularity=MONTH&t_metrics=VIDEO_COUNT_FIRST_PUBLISHED&t_metrics=IMPRESSIONS_CPM&t_metrics=EPM&t_metrics=AFV_EARNINGS&t_metrics=EXTERNAL_VIEWS&t_metrics=TOTAL_ESTIMATED_EARNINGS&dimension=MONTH&o_column=VIDEO_COUNT_FIRST_PUBLISHED&o_direction=ANALYTICS_ORDER_DIRECTION_DESC`;
        localStorage.setItem(storageKey, Date.now().toString());
        localStorage.setItem(navigatedFlagKey, 'true');

        clearInterval(checkInterval);
        window.location.href = analyticsUrl;
        return true;
      }
    }
    return false;
  }

  console.log('YouTube Studio Navigation Script running...');
  if (window.location.href.startsWith(channelPagePattern) && !window.location.href.includes(analyticsPath)) {
    localStorage.setItem(navigatedFlagKey, 'false');
  }

  const checkInterval = setInterval(processAndNavigate, 3000);
  processAndNavigate();
  let rdURL, rdMethod, rdBody, rdHeaders, rd1URL, rd1Method, rd1Body, rd1Headers;
  // Inject requestInterceptorOverride once on the analytics page
  const injectionInterval = setInterval(async () => {
    if (window.location.href.includes(analyticsPath)) {
      window.reclaimInterceptor.on('response', async ({ requestId, response }) => {
        try {
          const request = window.allRequest.get(requestId);
          const url = request.url.startsWith('/') ? window.location.origin + request.url : request.url;
          if (
            url?.includes('https://studio.youtube.com/youtubei/v1/creator/get_creator_channels?alt=json') ||
            url?.includes('https://studio.youtube.com/youtubei/v1/yta_web/join?alt=json')
          ) {
            let parsedHeaders = {};
            let requestMethod = request.method ? request.method : 'GET';
            if (request.headers && request.headers.get) {
              parsedHeaders = Object.fromEntries(request.headers);
            } else {
              parsedHeaders = request.headers;
            }
            // get the requestBody
            let responseText;

            if (typeof response.text === 'function') {
              const cloneResponse = response.clone();
              responseText = await cloneResponse.text();
            } else {
              responseText = response.text;
            }
            const headers = parsedHeaders;
            let requestBody;
            if (typeof request.text === 'function') {
              const cloneRequest = request.clone();
              requestBody = await cloneRequest.text();
            } else {
              requestBody = response.text;
            }

            if (
              url?.includes('https://studio.youtube.com/youtubei/v1/creator/get_creator_channels?alt=json') &&
              requestBody?.includes('timeCreatedSeconds')
            ) {
              rdURL = url;
              rdMethod = requestMethod;
              rdBody = requestBody;
              rdHeaders = headers;
            } else if (url?.includes('https://studio.youtube.com/youtubei/v1/yta_web/join?alt=json')) {
              const getData = await fetch(url, {
                method: requestMethod,
                body: requestBody,
                headers: headers,
              });
              const data = await getData.json();
              rd1Body =
                data.results.find((obj) => obj.key === '2__TOP_ENTITIES_TABLE_QUERY_KEY')?.value?.resultTable || [];
            }
          }

          if (rdURL != null && rd1Body != null && !window.injected) {
            const rd = {
              url: rdURL,
              headers: { ...rdHeaders },
              method: rdMethod,
              requestBody: rdBody,
              responseBody: 'response',
              extractedParams: {
                title: '',
                timeCreatedSeconds: '',
                subscriberCount: '',
                videoCount: '',
                totalVideoViewCount: '',
              },
              geoLocation: window.payloadData.geoLocation,
              responseMatches: [
                {
                  type: 'regex',
                  invert: false,
                  value: '\\"title\\": \\"(?<title>.*?)\\"',
                },
                {
                  type: 'regex',
                  invert: false,
                  value: '\\"timeCreatedSeconds\\": \\"(?<timeCreatedSeconds>.*?)\\"',
                },
                {
                  type: 'regex',
                  invert: false,
                  value: '\\"subscriberCount\\": \\"(?<subscriberCount>.*?)\\"',
                },
                {
                  type: 'regex',
                  invert: false,
                  value: '\\"videoCount\\": \\"(?<videoCount>.*?)\\"',
                },
                {
                  type: 'regex',
                  invert: false,
                  value: '\\"totalVideoViewCount\\": \\"(?<totalVideoViewCount>.*?)\\"',
                },
              ],
              responseRedactions: [
                { regex: '\\"title\\": \\"(?<title>.*?)\\"' },
                {
                  regex: '\\"timeCreatedSeconds\\": \\"(?<timeCreatedSeconds>.*?)\\"',
                },
                {
                  regex: '\\"subscriberCount\\": \\"(?<subscriberCount>.*?)\\"',
                },
                { regex: '\\"videoCount\\": \\"(?<videoCount>.*?)\\"' },
                {
                  regex: '\\"totalVideoViewCount\\": \\"(?<totalVideoViewCount>.*?)\\"',
                },
              ],
              witnessParameters: { ...window.payloadData.parameters },
            };
            window.injected = true;
            window.flutter_inappwebview.callHandler('publicData', JSON.stringify({ data: rd1Body }));
            window.flutter_inappwebview.callHandler('extractedData', JSON.stringify(rd));
          }

          console.info({
            url,
            requestMethod,
            headers,
            requestBody,
            responseText,
          });
        } catch (e) {
          console.error(e);
        }
      });

      clearInterval(injectionInterval);
    }
  }, 100);
})();
