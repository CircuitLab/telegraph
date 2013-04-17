var Tumblr = require('tumblrwks'),
  tumblrConfig = require('../config').tumblr;
var models = require('../models');
var Play = models.Play;
var db = models.db;

module.exports = TeleTumblr;

function TeleTumblr(){

  this.consumerKey = tumblrConfig.consumerKey;
  this.secretKey = tumblrConfig.secretKey;

  this.tumblr = new Tumblr(
  {
    consumerKey: tumblrConfig.consumerKey,
    consumerSecret: tumblrConfig.secretKey,
    accessToken: tumblrConfig.oauthToken,
    accessSecret: tumblrConfig.oauthTokenSecret
  }, "futuresemaphore.tumblr.com"
  // specify the blog url now or the time you want to use
);
  // console.log('Tumblr:',this.blog);
}

TeleTumblr.prototype.postPhoto = function(timestamp, callback, errorBack){
  var self = this;
  Play.findOne({timestamp: timestamp}, function(err, play){
    if(err) return errorBack(err);
    self.tumblr.post('/post', {type: 'photo', data: [play.animation]}, function(json){
      if(json.id === undefined) {
        console.error(json);
        return errorBack(json)
      };
      console.log('TeleTumblr post:',json.id);
      play.tumblr = json.id;
      play.save(function(err){
        if(err){ 
          console.error(err);
          return errorBack(err)
        };

        return callback(json.id);
      });
    });
  });
};