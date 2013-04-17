var Tumblr = require('tumblr').Tumblr,
  tumblrConfig = require('../config').tumblr;
var models = require('../models');
var Play = models.Play;
var db = models.db;

module.exports = TeleTumblr;

function TeleTumblr(){

  this.consumerKey = tumblrConfig.consumerKey;
  this.secretKey = tumblrConfig.secretKey;
  this.blog = new Tumblr('blog.tumblr.com', this.consumerKey);
}

TeleTumblr.prototype.postPhoto = function(timestamp, callback, errorBack){
  Play.findOne({timestamp: timestamp}, function(err, play){
    if(err) return errorBack(err);
    this.blog.photo({
      source: play.photoUrl()
    }, function(error, response) {
      if (error) {
          //throw new Error(error);
          console.error('Tumblr error:',error);
          console.error('photoUrl:', photoUrl);
          return errorBack(err);
      }
      console.log(response.posts);
      return callback();
    });
  });
};
