
/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , env = require('../lib/env')
  , config = {};

fs.readdirSync(__dirname).forEach(function(filename) {
  if (!/\.json/.test(filename)) return;
  var name = path.basename(filename, '.json');
  config[name] = require( path.join(__dirname, filename) );
});

config.tumblr = require( path.join(__dirname, 'secrets','tumblr.json') );
module.exports = config;