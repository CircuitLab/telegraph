/**
 * Module dependencies.
 */

var Schema = require('mongoose').Schema
  , config = require('../../config').server;

/**
 * Photo schema definition.
 */

var Play = module.exports = new Schema({
  url: String,
  animation: Buffer,
  frames: [Buffer],
  timestamp: Number,
  created:   { type: Date, default: Date.now, index: true }
});
