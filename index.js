var express = require('express');
var port = process.env.PORT || 3000;

var app = express();

app.use(function(req,res,next){setTimeout(next,Math.floor(Math.random() * (2000 - 1000 + 1) + 1000))});
app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Server started!');
