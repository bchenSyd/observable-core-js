var regExpFlags = require('../internals/regexp-flags');
var UNSUPPORTED_Y = require('../internals/regexp-sticky-helpers').UNSUPPORTED_Y;

// `RegExp.prototype.flags` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
if (/./g.flags != 'g' || UNSUPPORTED_Y) {
  Object.defineProperty(RegExp.prototype, 'flags', {
    configurable: true,
    get: regExpFlags,
  });
}
