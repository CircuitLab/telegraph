
exports.index = function(req, res) {

  var letters = [];
  for (var charCode = 65; charCode <= 90; charCode++) {
    letters.push(String.fromCharCode(charCode));
  };

  res.render('front/index', { title: 'デバタイプ', letters: letters });
};