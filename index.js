'use strict';

/*
 * Load dependencies
 */
 var pathtoRegexp = require('path-to-regexp');

 var currentPath = '';


/**
 * Configure multi page router by passing in an array
 * multiPageRouter([
 *   {'/foo' : [cb1, cb2] },
 *   {'/foo/:bar' : [cb1, cb2] },
 *   {'*' : [cb1, cb2] }
 * ])
 * @param  {Array} routeConfigs An array of route configuration objects
 */
function multiPageRouter(routeConfigs) {

};

module.expoerts = multiPageRouter;