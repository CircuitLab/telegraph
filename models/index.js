
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , fs = require('fs')
  , path = require('path')
  , morph = require('morph')
  , schema = path.join(__dirname, '/schema')
  , mongodb = require('../config').mongodb;

/**
 * Expose mongoose.
 */

exports.mongoose = mongoose;

/**
 * Set debug flag.
 */

mongoose.set('debug', 'production' !== process.env.NODE_ENV);

/**
 * Expose mongoose connection.
 */

var db = exports.db = mongoose.createConnection(mongodb.host, mongodb.database);

/**
 * Expose models.
 */

fs.readdirSync(schema).forEach(function(filename) {
  if (!/\.js/.test(filename)) return;
  var name = morph.toUpperCamel( path.basename(filename, '.js') );
  exports[name] = db.model(name, require(path.join(schema, filename)));
});

