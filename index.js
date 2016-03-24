'use strict';

/*
 * Load dependencies
 */
var pathToRegexp = require('path-to-regexp');

/*
 * Grab the current path from the window object
 */
var currentPath = window.location.pathname;

/**
 * Check if an object is an array.
 * @param  {Object}  arg the object to check
 * @return {Boolean}
 */
function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

/**
 * Remove URL encoding from the given `str`.
 * Accommodates whitespace in both x-www-form-urlencoded
 * and regular percent-encoded form.
 *
 * @param {string} val - URL component to decode
 */
function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') { return val; }
  return decodeURIComponent(val.replace(/\+/g, ' '));
};

/**
 * Configure multi page router by passing in an array.
 * Order is not guaranteed. TODO: potential enhancement?
 *
 * multiPageRouter({
 *   'foo' : [cb1, cb2],
 *   'foo/:bar' : cb,
 *   '*' : [cb1, cb3]
 * })
 *
 * @param  {Object} routeConfigs  an object containing the path to callbacks pair
 * @param  {Object} options       path-to-regexp configuration options
 */
function multiPageRouter(routeConfigs, options) {
  var path,
    callbacks;

  options = options || {};

  for (path in routeConfigs) {
    if (routeConfigs.hasOwnProperty(path)) {
      callbacks = routeConfigs[path];

      // ensure that callbacks is an array
      // by wrapping the single callback if needed
      if (!isArray(callbacks)) {
        if ('function' === typeof callbacks) {
          callbacks = [callbacks];
        }
        else {

          // since there is nothing to call just skip
          // this path
          continue;
        }
      }

      // try to match this path pattern
      matchPath(path, callbacks, options);
    }
  }
};

/**
 * Check if a path matches the currentPath and
 * dispatch a context to the callbacks if
 * the path matches. Pass an options object
 * to configure path-to-regexp.
 *
 * @param  {string} path      the path string to check window.location against
 * @param  {Array} callbacks  an array of callbacks to call incase path matches
 * @param  {Object} options   path-to-regexp configuration options
 */
function matchPath(path, callbacks, options) {
  var keys,
    key,
    val,
    matches,
    regExp,
    context,
    i;

  keys = [];
  context = {};
  path = (path === '*') ? '(.*)' : path;
  regExp = pathToRegexp(path, keys, options);
  matches = regExp.exec(currentPath);

  if (!matches) return;

  for (i = 1; i < matches.length; i++) {
    key = keys[i - 1];
    val = decodeURLEncodedURIComponent(matches[i]);

    if (undefined !== val && !context.hasOwnProperty(key.name)) {
      context[key.name] = val;
    }
  }

  dispatch(callbacks, context);
};

/**
 * Dispatch a context to an array of callbacks.
 *
 * @param  {Array} callbacks an array containing callback functions
 * @param  {Object} context   the context object to give to the functions
 */
function dispatch(callbacks, context) {

  var idx = 0;

  function _dispatchNext() {
    var cb = callbacks[idx++],
      args;

    if ('function' !== typeof cb) return;

    args = [context, _dispatchNext].concat(Array.prototype.slice.call(arguments));

    cb.apply(cb, args);
  }

  _dispatchNext();
};

module.exports = multiPageRouter;