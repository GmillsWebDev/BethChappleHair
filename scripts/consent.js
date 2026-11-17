/*
 * Cookie consent (UK GDPR / PECR).
 * Nothing optional runs until the visitor opts in:
 *   - analytics: Google Analytics 4 (loaded only after consent)
 *   - maps:      the embedded Google Map (click-to-load placeholder until consent)
 * The choice is kept in localStorage under "bch-consent" (strictly necessary, not a cookie).
 * Bump CONSENT_VERSION if the categories change, so everyone is asked again.
 */
'use strict';

(() => {
  const GA_ID = 'G-V801EGG6QR';
  const STORAGE_KEY = 'bch-consent';
  const CONSENT_VERSION = 1;

  // Page state
  let gaLoaded = false;
  let banner = null;

  const script = document.currentScript;
  const policyUrl = new URL('../cookies.html', script ? script.src : location.href).href;

  function readConsent() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored?.version === CONSENT_VERSION ? stored : null;
    } catch {
      return null;
    }
  }

  function saveConsent(choices) {
    const consent = {
      version: CONSENT_VERSION,
      analytics: Boolean(choices.analytics),
      maps: Boolean(choices.maps),
      date: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      /* storage blocked: honour the choice for this page view only */
    }
    applyConsent(consent);
    hideBanner();
    document.dispatchEvent(new CustomEvent('bch:consentchange', { detail: consent }));
    return consent;
  }

  /* ---------- Google Analytics ---------- */

  function enableAnalytics() {
    window[`ga-disable-${GA_ID}`] = false;
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    // Must stay a regular function pushing the real `arguments` object: gtag.js ignores plain arrays, so arrow functions / rest parameters would silently break GA.
    window.gtag = function () { // skipcq: JS-0241
      window.dataLayer.push(arguments); // skipcq: JS-0244
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(tag);
  }

  function disableAnalytics() {
    window[`ga-disable-${GA_ID}`] = true;
    const host = location.hostname;
    const parts = host.split('.');
    const domains = ['', host, `.${host}`];
    for (let i = 1; i < parts.length - 1; i++) {
      domains.push(`.${parts.slice(i).join('.')}`);
    }
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name === '_gat') {
        domains.forEach((domain) => {
          document.cookie =
            `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
        });
      }
    });
  }

  /* ---------- Google Maps embed ---------- */

  function setMaps(allowed) {
    document.querySelectorAll('[data-map-consent]').forEach((wrapper) => {
      const frame = wrapper.querySelector('iframe');
      const placeholder = wrapper.querySelector('.mapPlaceholder');
      if (!frame) return;
      if (allowed) {
        if (!frame.getAttribute('src')) frame.setAttribute('src', frame.getAttribute('data-src'));
        frame.hidden = false;
        if (placeholder) placeholder.hidden = true;
      } else {
        frame.removeAttribute('src');
        frame.hidden = true;
        if (placeholder) placeholder.hidden = false;
      }
    });
  }

  function applyConsent(consent) {
    if (consent?.analytics) enableAnalytics();
    else disableAnalytics();
    setMaps(Boolean(consent?.maps));
  }

  /* ---------- Banner ---------- */

  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>I’d like to use optional cookies for anonymous visitor statistics (Google Analytics) ' +
      'and to show Google Maps. Nothing optional is set unless you agree. ' +
      `<a href="${policyUrl}">Read the cookie policy</a>.</p>` +
      '<div class="cookieBanner__actions">' +
      '<button type="button" class="consentBtn" data-consent="reject">Reject optional</button>' +
      '<button type="button" class="consentBtn" data-consent="accept">Accept all</button>' +
      `<a href="${policyUrl}#cookie-settings">Choose settings</a>` +
      '</div>';
    banner.addEventListener('click', (event) => {
      const choice = event.target.closest('[data-consent]');
      if (!choice) return;
      const accept = choice.getAttribute('data-consent') === 'accept';
      saveConsent({ analytics: accept, maps: accept });
    });
    document.body.appendChild(banner);
  }

  function hideBanner() {
    if (banner) {
      banner.remove();
      banner = null;
    }
  }

  /* ---------- Settings form (cookies.html) and map buttons ---------- */

  function initSettingsForm() {
    const form = document.getElementById('cookieSettingsForm');
    if (!form) return;
    const status = form.querySelector('.consentStatus');

    function fill(consent) {
      form.elements.analytics.checked = Boolean(consent?.analytics);
      form.elements.maps.checked = Boolean(consent?.maps);
    }
    fill(readConsent());

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      saveConsent({
        analytics: form.elements.analytics.checked,
        maps: form.elements.maps.checked
      });
      if (status) status.textContent = 'Your cookie settings have been saved.';
    });
    document.addEventListener('bch:consentchange', (event) => {
      fill(event.detail);
    });
  }

  function initMapButtons() {
    document.querySelectorAll('[data-map-load]').forEach((button) => {
      button.addEventListener('click', () => {
        const current = readConsent() || {};
        saveConsent({ analytics: Boolean(current.analytics), maps: true });
      });
    });
  }

  function init() {
    const consent = readConsent();
    applyConsent(consent);
    initSettingsForm();
    initMapButtons();
    if (!consent) showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
