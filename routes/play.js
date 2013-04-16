//TODO show play gif
exports.show = function(req, res) {
  var timestamp = req.query['timestamp'];
  res.render('play/index', { title: 'デバタイプ', letters: letters });
};