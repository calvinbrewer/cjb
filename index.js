var express = require('express');
var port = process.env.PORT || 3000;

var app = express();

app.get('/portfolio', function(req,res){
  res.sendFile(__dirname + '/public/portfolio.html');
});

app.use(express.static(__dirname + '/public'));
app.listen(port);
