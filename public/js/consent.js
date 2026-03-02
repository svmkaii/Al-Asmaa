/**
 * Al-Asmaa — Cookie Consent Banner (RGPD / ePrivacy)
 * Blocks Google Analytics until the user gives explicit consent.
 */
(function () {
  'use strict';

  var GA_ID = 'G-LQ6P2VEF0R';
  var STORAGE_KEY = 'al-asmaa-cookie-consent';

  // ---------- GA loader ----------
  function loadGA() {
    if (document.getElementById('ga-script')) return;
    var s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // ---------- Cookie cleanup ----------
  function clearGACookies() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var name = cookies[i].split('=')[0].trim();
      if (name === '_ga' || name === '_gid' || name.indexOf('_ga_') === 0) {
        var domains = [window.location.hostname, '.' + window.location.hostname];
        for (var d = 0; d < domains.length; d++) {
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + domains[d];
        }
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    }
  }

  // ---------- Banner ----------
  function showBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentement cookies');
    banner.innerHTML =
      /* Decorative top glow line */
      '<div id="ccb-glow"></div>' +
      /* Animated shimmer overlay */
      '<div id="ccb-shimmer"></div>' +
      '<div id="ccb-inner">' +
        /* Icon */
        '<div id="ccb-icon-wrap">' +
          '<div id="ccb-icon-glow"></div>' +
          '<div id="ccb-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
              '<path d="M9 12l2 2 4-4"/>' +
            '</svg>' +
          '</div>' +
        '</div>' +
        /* Text content */
        '<div id="ccb-body">' +
          '<p id="ccb-title">Cookies &amp; Confidentialit\u00e9</p>' +
          '<p id="ccb-text">' +
            'Nous utilisons <strong>Google\u00a0Analytics</strong> pour comprendre comment le site est utilis\u00e9, ' +
            'de mani\u00e8re <strong>100\u00a0% anonyme</strong>. Aucune donn\u00e9e personnelle n\u2019est collect\u00e9e.' +
          '</p>' +
          '<a href="/politique-de-confidentialite" id="ccb-link">' +
            '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
            ' En savoir plus' +
          '</a>' +
        '</div>' +
        /* Buttons */
        '<div id="ccb-actions">' +
          '<button type="button" id="ccb-accept"><span id="ccb-accept-glow"></span>Accepter</button>' +
          '<button type="button" id="ccb-refuse">Refuser</button>' +
        '</div>' +
      '</div>';

    // ---------- Styles ----------
    var style = document.createElement('style');
    style.id = 'ccb-styles';
    style.textContent =
      /* ---- Container ---- */
      '#cookie-consent-banner{' +
        'position:fixed;bottom:1.5rem;left:50%;z-index:100000;' +
        'width:calc(100% - 3rem);max-width:620px;' +
        'transform:translateX(-50%);' +
        'background:linear-gradient(165deg,rgba(15,19,36,0.94) 0%,rgba(10,12,24,0.97) 100%);' +
        'backdrop-filter:blur(30px) saturate(1.5);-webkit-backdrop-filter:blur(30px) saturate(1.5);' +
        'border:1px solid rgba(212,162,76,0.14);' +
        'border-radius:22px;' +
        'padding:1.6rem 1.8rem;' +
        'font-family:"Outfit",system-ui,sans-serif;' +
        'box-shadow:' +
          '0 20px 60px rgba(0,0,0,0.6),' +
          '0 8px 24px rgba(0,0,0,0.4),' +
          '0 0 0 1px rgba(255,255,255,0.03),' +
          '0 0 120px -40px rgba(212,162,76,0.08);' +
        'animation:ccb-enter .5s cubic-bezier(.16,1,.3,1) both;' +
        'overflow:hidden' +
      '}' +
      '#cookie-consent-banner.ccb-exit{' +
        'animation:ccb-leave .3s cubic-bezier(.4,0,1,1) both' +
      '}' +

      /* ---- Keyframes ---- */
      '@keyframes ccb-enter{' +
        '0%{opacity:0;transform:translateX(-50%) translateY(30px) scale(0.95)}' +
        '100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}' +
      '}' +
      '@keyframes ccb-leave{' +
        '0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}' +
        '100%{opacity:0;transform:translateX(-50%) translateY(20px) scale(0.97)}' +
      '}' +
      '@keyframes ccb-shimmer{' +
        '0%{transform:translateX(-100%) rotate(12deg)}' +
        '100%{transform:translateX(200%) rotate(12deg)}' +
      '}' +
      '@keyframes ccb-icon-pulse{' +
        '0%,100%{box-shadow:0 0 0 0 rgba(212,162,76,0.3)}' +
        '50%{box-shadow:0 0 0 8px rgba(212,162,76,0)}' +
      '}' +

      /* ---- Decorative ---- */
      '#ccb-glow{' +
        'position:absolute;top:0;left:10%;right:10%;height:1px;' +
        'background:linear-gradient(90deg,transparent,rgba(212,162,76,0.45) 30%,rgba(240,204,122,0.6) 50%,rgba(212,162,76,0.45) 70%,transparent);' +
        'pointer-events:none' +
      '}' +
      '#ccb-shimmer{' +
        'position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:22px' +
      '}' +
      '#ccb-shimmer::after{' +
        'content:"";position:absolute;top:-50%;bottom:-50%;width:40px;' +
        'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);' +
        'animation:ccb-shimmer 4s ease-in-out infinite 1s' +
      '}' +

      /* ---- Layout ---- */
      '#ccb-inner{' +
        'display:flex;align-items:center;gap:1.2rem;position:relative' +
      '}' +

      /* ---- Icon ---- */
      '#ccb-icon-wrap{' +
        'position:relative;flex-shrink:0' +
      '}' +
      '#ccb-icon{' +
        'width:46px;height:46px;' +
        'background:linear-gradient(145deg,rgba(212,162,76,0.18),rgba(212,162,76,0.06));' +
        'border:1px solid rgba(212,162,76,0.22);border-radius:14px;' +
        'display:flex;align-items:center;justify-content:center;' +
        'color:#d4a24c;position:relative;' +
        'animation:ccb-icon-pulse 3s ease-in-out infinite' +
      '}' +
      '#ccb-icon svg{width:22px;height:22px;filter:drop-shadow(0 0 4px rgba(212,162,76,0.3))}' +
      '#ccb-icon-glow{' +
        'position:absolute;inset:-6px;' +
        'background:radial-gradient(circle,rgba(212,162,76,0.12) 0%,transparent 70%);' +
        'border-radius:20px;pointer-events:none' +
      '}' +

      /* ---- Body ---- */
      '#ccb-body{flex:1;min-width:0}' +
      '#ccb-title{' +
        'margin:0 0 0.35rem;font-size:0.88rem;font-weight:700;letter-spacing:0.02em;' +
        'background:linear-gradient(135deg,#f0cc7a 0%,#d4a24c 60%,#a67c2e 100%);' +
        '-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text' +
      '}' +
      '#ccb-text{' +
        'margin:0 0 0.4rem;font-size:0.8rem;line-height:1.6;color:rgba(255,255,255,0.58)' +
      '}' +
      '#ccb-text strong{color:rgba(255,255,255,0.82);font-weight:600}' +
      '#ccb-link{' +
        'display:inline-flex;align-items:center;gap:4px;' +
        'font-size:0.72rem;font-weight:500;color:rgba(212,162,76,0.7);text-decoration:none;' +
        'transition:color .2s' +
      '}' +
      '#ccb-link:hover{color:#f0cc7a}' +
      '#ccb-link svg{opacity:0.6}' +

      /* ---- Buttons ---- */
      '#ccb-actions{display:flex;flex-direction:column;gap:0.45rem;flex-shrink:0}' +
      '#ccb-accept,#ccb-refuse{' +
        'border:none;cursor:pointer;font-family:inherit;font-weight:600;' +
        'border-radius:12px;transition:all .25s cubic-bezier(.4,0,.2,1);' +
        'letter-spacing:0.02em;position:relative;overflow:hidden' +
      '}' +
      '#ccb-accept{' +
        'font-size:0.82rem;padding:0.65rem 1.5rem;' +
        'background:linear-gradient(175deg,#e8b84a 0%,#c9952e 50%,#a67c2e 100%);' +
        'color:#1a1000;' +
        'border:1px solid rgba(255,230,160,0.2);' +
        'text-shadow:0 1px 0 rgba(255,230,160,0.3);' +
        'box-shadow:' +
          '0 4px 16px rgba(212,162,76,0.3),' +
          '0 1px 3px rgba(0,0,0,0.3),' +
          'inset 0 1px 0 rgba(255,230,160,0.4),' +
          'inset 0 -2px 0 rgba(0,0,0,0.12)' +
      '}' +
      '#ccb-accept-glow{' +
        'position:absolute;inset:0;' +
        'background:linear-gradient(to bottom,rgba(255,255,255,0.15) 0%,transparent 50%);' +
        'pointer-events:none' +
      '}' +
      '#ccb-accept:hover{' +
        'transform:translateY(-1px);' +
        'box-shadow:' +
          '0 6px 24px rgba(212,162,76,0.45),' +
          '0 2px 6px rgba(0,0,0,0.3),' +
          'inset 0 1px 0 rgba(255,230,160,0.5),' +
          'inset 0 -2px 0 rgba(0,0,0,0.12),' +
          '0 0 0 1px rgba(255,216,102,0.2)' +
      '}' +
      '#ccb-accept:active{transform:translateY(1px) scale(0.97);filter:brightness(0.92)}' +
      '#ccb-refuse{' +
        'font-size:0.73rem;padding:0.45rem 1.2rem;' +
        'background:transparent;color:rgba(255,255,255,0.4);' +
        'border:none' +
      '}' +
      '#ccb-refuse:hover{color:rgba(255,255,255,0.7)}' +

      /* ---- Mobile ---- */
      '@media(max-width:600px){' +
        '#cookie-consent-banner{' +
          'bottom:0.85rem;width:calc(100% - 1.6rem);' +
          'padding:1.3rem 1.3rem;border-radius:18px' +
        '}' +
        '#ccb-inner{flex-wrap:wrap;gap:0.8rem}' +
        '#ccb-icon-wrap{display:none}' +
        '#ccb-body{min-width:100%}' +
        '#ccb-actions{' +
          'flex-direction:row;width:100%;align-items:center;gap:0.3rem' +
        '}' +
        '#ccb-accept{flex:1}' +
        '#ccb-refuse{flex-shrink:0}' +
      '}' +

      /* ---- Reduced motion ---- */
      '@media(prefers-reduced-motion:reduce){' +
        '#cookie-consent-banner{animation:none}' +
        '#cookie-consent-banner.ccb-exit{animation:none;display:none}' +
        '#ccb-shimmer::after{animation:none}' +
        '#ccb-icon{animation:none}' +
      '}';

    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById('ccb-accept').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      dismissBanner(function () { loadGA(); });
    });

    document.getElementById('ccb-refuse').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'refused');
      dismissBanner(function () { clearGACookies(); });
    });
  }

  function dismissBanner(callback) {
    var b = document.getElementById('cookie-consent-banner');
    if (!b) return;
    b.classList.add('ccb-exit');
    b.addEventListener('animationend', function () {
      b.remove();
      if (callback) callback();
    }, { once: true });
    // Fallback if animationend doesn't fire
    setTimeout(function () {
      if (document.getElementById('cookie-consent-banner')) {
        b.remove();
        if (callback) callback();
      }
    }, 400);
  }

  // ---------- Public API ----------
  window.alAsmaaOpenConsentBanner = function () {
    localStorage.removeItem(STORAGE_KEY);
    var existing = document.getElementById('cookie-consent-banner');
    if (existing) existing.remove();
    showBanner();
  };

  // ---------- Init ----------
  var consent = localStorage.getItem(STORAGE_KEY);

  if (consent === 'accepted') {
    loadGA();
  } else if (consent === 'refused') {
    // Do nothing, GA stays blocked
  } else {
    // No choice yet — show banner after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
