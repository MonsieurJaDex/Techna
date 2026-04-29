// Metro config to avoid pulling ESM builds with `import.meta` on web.
// We prefer CJS (`main`) over ESM (`module`) for compatibility with Metro's runtime.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Fix Metro HMR crash on web when it registers "/?platform=web" (no bundleEntry).
// This happens on some Node/Metro combos and breaks development entirely.
config.server = config.server || {};
const prevRewrite = config.server.rewriteRequestUrl;
config.server.rewriteRequestUrl = (url) => {
  const rewritten = typeof prevRewrite === 'function' ? prevRewrite(url) : url;
  try {
    const u = new URL(rewritten);
    const isWeb = u.searchParams.get('platform') === 'web';
    const hasBundleEntry = Boolean(u.searchParams.get('bundleEntry'));
    const emptyPath = u.pathname === '' || u.pathname === '/';
    if (isWeb && emptyPath) {
      // `jsc-safe-url` crashes when query exists but path is empty or "/".
      // Give it a stable non-empty pathname.
      u.pathname = '/index';
      if (!hasBundleEntry) u.searchParams.set('bundleEntry', 'node_modules/expo-router/entry');
      return u.toString();
    }
  } catch {
    // ignore non-absolute URLs
  }
  return rewritten;
};

module.exports = config;

