/**
 * Module dependencies.
 */

var Schema = require('mongoose').Schema
  , config = require('../../config').server;

/**
 * Photo schema definition.
 */

var Play = module.exports = new Schema({
  tumblr: String,
  animation: Buffer,
  frames: [Buffer],
  timestamp: Number,
  message: String,
  created: { type: Date, default: Date.now, index: true },
});

Play.methods.gifUrl = function(){
  var url = 'http://teba.uniba.jp/plays/'+ this.timestamp +'/animation'
  return url;
};