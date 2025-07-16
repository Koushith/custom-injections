/*
 get card number, first name and last name
 Injection Type: HAWKEYE 
*/

if (window.location.href === 'https://all.accor.com/a/en.html') {
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

      const openLoginMenuBtn = document.querySelector('.button-logo__button--disconnected');
      if (openLoginMenuBtn && !window.buttonClicked) {
        openLoginMenuBtn.click();

        // Step 2: Wait a short time (e.g., 500ms) for the menu to open, then click "Sign in"
        setTimeout(() => {
          const signInBtn = document.querySelector(
            '#login-nav-menu-wrapper .login-nav__item-button--round-sec.login-nav__item--round__button__clear'
          );
          if (signInBtn) {
            window.buttonClicked = true;
            signInBtn.click();
            window.Reclaim.requiresUserInteraction(false);
          } else {
            console.warn('Sign in button not found.');
          }
        }, 500);
      } else {
        console.warn('Open login menu button not found.');
      }

      const element = document.querySelector('.button-logo__text--connected');
      if (element) {
        window.injected = true;
        window.location.href = 'https://all.accor.com/account/index.en.shtml#/dashboard';
      }
    } catch (e) {
      console.error('Injection error:', e);
    }
  }, 1000);
}

if (window.location.href.includes('https://all.accor.com/loyalty-funnel/en')) {
  setInterval(async () => {
    try {
      window.location.href = 'https://all.accor.com/account/index.en.shtml#/dashboard';
    } catch (e) {
      console.error('Injection error:', e);
    }
  }, 1000);
}

if (window.location.href.includes('https://login.accor.com/oidc/sign-in')) {
  setInterval(async () => {
    try {
      window.Reclaim.requiresUserInteraction(false);
    } catch (e) {
      console.error('Injection error:', e);
    }
  }, 1000);
}
