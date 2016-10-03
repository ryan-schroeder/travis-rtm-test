'use strict'
var express = require('express');

module.exports = {
  eyebrows: function() {
    return 'THOSE EYEBROWS'
  },

  startExpress: function() {
    var app = express();
    
    app.get('/', function (req, res) {
      res.send('YO');
    });
    
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
    });
  }
}
