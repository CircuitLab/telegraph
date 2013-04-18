var config = require('../config');

var models = require('../models');
var Play = models.Play;
var db = models.db;

//TODO show play gif
exports.show = function(req, res) {
  var timestamp = req.params.timestamp;
  Play.findOne({timestamp: timestamp}, function(err, play){
    if(err) return res.send(404);
    res.render('play/show', 
      { 
        title: 'デバタイプ', 
        message: play.message,
        imgUrl: play.gifUrl(),
    });
  });
  
};

exports.animation = function(req, res){
  var timestamp = req.params.timestamp;
  Play.findOne({timestamp: timestamp}, function(err, play){
    if(err) return res.send(404);
    res.type('gif');
    res.send(play.animation);
  });
}