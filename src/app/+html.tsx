import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ScrollViewStyleReset />
        <style>{`
          html, body { background: #ffffff; }
          #__boot { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background:#fff; color:#111827; font: 700 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
          #__web_error { position: fixed; left: 12px; right: 12px; bottom: 12px; background: rgba(11,15,20,0.92); color: #F9FAFB; border: 1px solid rgba(229,231,235,0.2); border-radius: 14px; padding: 12px; max-height: 45vh; overflow: auto; white-space: pre-wrap; font: 600 12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                // If a bundle contains \`import.meta\`, it MUST be executed as a module script.
                // Expo Router injects the web bundle as a classic deferred script; on some setups
                // Metro may still include \`import.meta\` (e.g. import.meta.env), causing a hard SyntaxError.
                // This observer replaces that script with an equivalent <script type="module">.
                try {
                  var BUNDLE_RE = /\\/node_modules\\/expo-router\\/entry\\.bundle\\?/;
                  function replaceScript(s) {
                    try {
                      if (!s || !s.src || !BUNDLE_RE.test(s.src)) return;
                      if (s.type === 'module') return;
                      var m = document.createElement('script');
                      m.type = 'module';
                      // cache-bust to avoid old cached bundle
                      var sep = s.src.indexOf('?') >= 0 ? '&' : '?';
                      m.src = s.src + sep + 'module=1&ts=' + Date.now();
                      m.defer = true;
                      s.parentNode && s.parentNode.insertBefore(m, s.nextSibling);
                      s.parentNode && s.parentNode.removeChild(s);
                    } catch (e) {}
                  }

                  var mo = new MutationObserver(function () {
                    var scripts = document.getElementsByTagName('script');
                    for (var i = 0; i < scripts.length; i++) replaceScript(scripts[i]);
                  });
                  mo.observe(document.documentElement, { childList: true, subtree: true });
                  // Run once for already-parsed scripts.
                  var scripts0 = document.getElementsByTagName('script');
                  for (var i0 = 0; i0 < scripts0.length; i0++) replaceScript(scripts0[i0]);
                } catch (e) {}

                // Guard against stale cached bundles (e.g. service workers).
                try {
                  if (typeof navigator !== 'undefined' && navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
                    navigator.serviceWorker.getRegistrations().then(function (regs) {
                      regs.forEach(function (r) { try { r.unregister(); } catch (e) {} });
                    });
                  }
                  if (typeof caches !== 'undefined' && caches.keys) {
                    caches.keys().then(function (keys) {
                      keys.forEach(function (k) { try { caches.delete(k); } catch (e) {} });
                    });
                  }
                } catch (e) {}

                function ensureEl() {
                  var el = document.getElementById('__web_error');
                  if (!el) {
                    el = document.createElement('div');
                    el.id='__web_error';
                    document.body.appendChild(el);
                  }
                  return el;
                }
                function show(msg) {
                  try {
                    var el = ensureEl();
                    el.textContent = String(msg || 'Unknown error');
                  } catch (_) {}
                }
                window.addEventListener('error', function (e) {
                  show((e && (e.error && e.error.stack)) || (e && e.message) || e);
                });
                window.addEventListener('unhandledrejection', function (e) {
                  show((e && e.reason && e.reason.stack) || (e && e.reason) || e);
                });
                window.__hideBoot = function () {
                  var b = document.getElementById('__boot');
                  if (b) b.remove();
                };
              })();
            `,
          }}
        />
      </head>
      <body>
        <div id="__boot">Загрузка…</div>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `setTimeout(function(){ if (window.__hideBoot) window.__hideBoot(); }, 15000);` }} />
      </body>
    </html>
  );
}

