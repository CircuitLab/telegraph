
/*
 * GET home page.
 */

var fs = require('fs')
  , path = require('path')
  , config = {};

fs.readdirSync(__dirname).forEach(function(filename) {
  var name = path.basename(filename, '.js');
  config[name] = require(path.join(__dirname, filename));
});

module.exports = config;