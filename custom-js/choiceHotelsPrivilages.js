/**
 * Choice Hotels Privilages
 * Injection Type: HAWKEYE
 * providerID: 25a90a1b-d5a2-458e-8b69-a7a1f54eae52
 *
 * Injection is for Page Navigation
 */

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function isLoggedIn() {
  // Check for key session cookies
  const ct0 = getCookie('ct0');
  const twid = getCookie('twid');
  const userHasLoggedIn = getCookie('UserHasLoggedIn');

  return (ct0 && twid) || userHasLoggedIn === 'true';
}

async function navigateToPage() {
  const isPageNavigated = window.sessionStorage.getItem('pageNavigated');

  const currentPage = window.location.href;
  const redirectPage = 'https://www.choicehotels.com/choice-privileges/account';
  const loggedIn = isLoggedIn();

  console.log('currentPage', currentPage);
  console.log('redirectPage', redirectPage);
  console.log('loggedIn', loggedIn);
  console.log('isPageNavigated', isPageNavigated);
  console.log(
    "loggedIn && !currentPage.includes('choice-privileges/account') && isPageNavigated === 'false'",
    loggedIn && !currentPage.includes('choice-privileges/account') && isPageNavigated === 'false'
  );

  if (loggedIn && !currentPage.includes('choice-privileges/account') && isPageNavigated === 'false') {
    window.sessionStorage.setItem('pageNavigated', 'true');
    window.location.href = redirectPage;
  }

  return;
}

window.sessionStorage.setItem('pageNavigated', 'false');
navigateToPage();
setInterval(navigateToPage, 5000);
