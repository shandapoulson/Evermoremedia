/*
 * Evermore Media: email sign-up popup
 *
 * Shows a small sign-up card after a visitor has been on the site for
 * DELAY_SECONDS. If they close it, it stays hidden for SNOOZE_DAYS.
 * If they sign up, it never shows again on that browser.
 *
 * To connect it to your email list, set FORM_ACTION below:
 *   - Formspree:  https://formspree.io/f/YOUR_ID   (emails you each sign-up)
 *   - Or the form "action" URL from Mailchimp, Flodesk, Kit, etc.
 * While it still says YOUR_NEWSLETTER_FORM_ID, the popup works but
 * doesn't send anything anywhere.
 */
(function () {
  var FORM_ACTION = 'https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID';
  var DELAY_SECONDS = 30;
  var SNOOZE_DAYS = 14;
  var KEY = 'em-popup';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
  }

  var state = read();
  if (state.subscribed) return;
  if (state.snoozedUntil && Date.now() < state.snoozedUntil) return;

  var css = [
    '.emp-backdrop{position:fixed;inset:0;background:rgba(28,50,35,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000;opacity:0;transition:opacity .25s ease}',
    '.emp-backdrop.emp-in{opacity:1}',
    '.emp-card{position:relative;width:100%;max-width:440px;box-sizing:border-box;background:#FAF5EE;color:#1C3223;border:2px solid #1C3223;border-radius:32px;padding:32px 28px 26px;font-family:"DM Sans",system-ui,sans-serif;transform:translateY(16px);transition:transform .3s ease;max-height:calc(100vh - 32px);overflow:auto}',
    '.emp-in .emp-card{transform:none}',
    '.emp-close{position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:50%;border:2px solid #1C3223;background:#FFFFFF;color:#1C3223;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}',
    '.emp-art{display:block;height:120px;width:auto;margin:0 auto 8px}',
    '.emp-tag{display:inline-block;transform:rotate(-4deg);padding:6px 14px;border-radius:999px;background:#D4C2F2;border:2px solid #1C3223;font-family:"Instrument Serif",serif;font-style:italic;font-size:18px}',
    '.emp-title{margin:14px 0 8px;font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:32px;line-height:1.02;letter-spacing:-.03em}',
    '.emp-title em{font-family:"Instrument Serif",serif;font-weight:400;font-style:italic;letter-spacing:-.01em}',
    '.emp-text{margin:0 0 18px;font-size:16px;line-height:1.55;color:#4B5A57}',
    '.emp-list{margin:0 0 18px;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}',
    '.emp-list li{padding:6px 12px;border-radius:999px;font-size:13px;font-weight:600}',
    '.emp-form{display:flex;flex-direction:column;gap:10px}',
    '.emp-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}',
    '.emp-input{min-height:52px;padding:0 16px;border-radius:14px;border:2px solid #1C3223;background:#FFFFFF;font:inherit;font-size:16px;color:#1C3223;box-sizing:border-box;width:100%}',
    '.emp-input.emp-bad{border-color:#8A2C1C}',
    '.emp-err{margin:0;font-size:14px;font-weight:600;color:#8A2C1C}',
    '.emp-btn{min-height:54px;border-radius:999px;background:#A9C08B;color:#1C3223;border:2px solid #1C3223;font:inherit;font-weight:700;font-size:17px;cursor:pointer}',
    '.emp-btn:disabled{opacity:.6;cursor:default}',
    '.emp-fine{margin:12px 0 0;font-size:12.5px;color:#4B5A57;text-align:center}',
    '.emp-close:focus-visible,.emp-btn:focus-visible,.emp-input:focus{outline:3px solid #A9C08B;outline-offset:2px}',
    '@media (max-width:480px){.emp-card{padding:28px 20px 22px;border-radius:26px}.emp-title{font-size:28px}.emp-art{height:96px}}',
    '@media (prefers-reduced-motion:reduce){.emp-backdrop,.emp-card{transition:none}}'
  ].join('');

  var formHTML =
    '<form class="emp-form" novalidate>' +
    '<label class="emp-label" for="emp-email">Email address</label>' +
    '<input class="emp-input" id="emp-email" type="email" name="email" autocomplete="email" placeholder="you@yourbusiness.com" required>' +
    '<input type="hidden" name="source" value="Website pop-up">' +
    '<p class="emp-err" hidden>Please add a valid email.</p>' +
    '<button class="emp-btn" type="submit">Sign me up</button>' +
    '</form>' +
    '<p class="emp-fine">A friendly email now and then. No spam, unsubscribe anytime. <a href="privacy.html">Privacy Policy</a></p>';

  var doneHTML =
    '<h2 class="emp-title" id="emp-title">You’re on <em>the list!</em></h2>' +
    '<p class="emp-text">Thanks for joining. Look out for marketing tips and Evermore updates in your inbox soon.</p>' +
    '<button class="emp-btn" type="button" data-emp-close>Back to the site</button>';

  var opener = null;

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'emp-backdrop';
    wrap.innerHTML =
      '<div class="emp-card" role="dialog" aria-modal="true" aria-labelledby="emp-title">' +
      '<button class="emp-close" type="button" aria-label="Close" data-emp-close>' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
      '<div class="emp-body">' +
      '<img class="emp-art" src="assets/illo-laptop.png" alt="">' +
      '<span class="emp-tag">the good stuff</span>' +
      '<h2 class="emp-title" id="emp-title">Marketing tips, <em>straight to your inbox</em></h2>' +
      '<p class="emp-text">Join our list for easy social media tips, fresh ideas and exciting Evermore updates.</p>' +
      '<ul class="emp-list">' +
      '<li style="background:#234A2F;color:#FAF5EE">Content ideas</li>' +
      '<li style="background:#F7DE7A">Seasonal tips</li>' +
      '<li style="background:#D4C2F2">Studio news</li>' +
      '</ul>' +
      formHTML +
      '</div></div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  function open() {
    var wrap = build();
    var card = wrap.querySelector('.emp-card');
    var body = wrap.querySelector('.emp-body');
    opener = document.activeElement;
    requestAnimationFrame(function () { wrap.classList.add('emp-in'); });
    var input = wrap.querySelector('.emp-input');
    setTimeout(function () { (input || card).focus(); }, 60);

    function close(snooze) {
      if (snooze) save({ snoozedUntil: Date.now() + SNOOZE_DAYS * 864e5 });
      wrap.classList.remove('emp-in');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { wrap.remove(); if (opener && opener.focus) opener.focus(); }, 250);
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(!read().subscribed); return; }
      if (e.key !== 'Tab') return;
      var f = card.querySelectorAll('button, input:not([type=hidden]), a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);

    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.closest('[data-emp-close]')) close(!read().subscribed);
    });

    var form = wrap.querySelector('.emp-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.emp-err');
      var ok = /.+@.+\..+/.test(input.value.trim());
      input.classList.toggle('emp-bad', !ok);
      err.hidden = ok;
      if (!ok) { input.focus(); return; }
      var btn = form.querySelector('.emp-btn');
      btn.disabled = true; btn.textContent = 'Signing you up…';
      var done = function () {
        save({ subscribed: true });
        body.innerHTML = doneHTML;
        body.querySelector('.emp-btn').focus();
      };
      if (FORM_ACTION.indexOf('YOUR_NEWSLETTER_FORM_ID') !== -1) { done(); return; }
      fetch(FORM_ACTION, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) done();
          else { btn.disabled = false; btn.textContent = 'Sign me up'; err.textContent = 'Something went wrong. Please try again.'; err.hidden = false; }
        })
        .catch(function () { btn.disabled = false; btn.textContent = 'Sign me up'; err.textContent = 'Something went wrong. Please try again.'; err.hidden = false; });
    });
  }

  // Count time across pages, so 30 seconds spread over a few pages still counts.
  var spent = Number(state.seconds || 0);
  var shown = false;
  var timer = setInterval(function () {
    if (document.hidden) return;
    spent += 1;
    var s = read(); s.seconds = spent; save(s);
    if (!shown && spent >= DELAY_SECONDS) {
      shown = true;
      clearInterval(timer);
      open();
    }
  }, 1000);
})();
