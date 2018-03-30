var express = require('express');
var port = process.env.PORT || 3000;

var app = express();
var pagecount = 1;

app.get('/pagecount-esi-1', function (req, res, next) {
    res.send("<span id='p'>" + pagecount + "</span>");
    pagecount += 1;
});

// app.use(function(req,res,next){setTimeout(next,Math.floor(Math.random() * (2000 - 1000 + 1) + 1000))});

app.get('/pagecount', function (req, res, next) {
    res.json({ pagecount: pagecount });
    pagecount += 1;
});

app.get('/pagecount-esi', function (req, res, next) {
    res.send("<span id='p'>" + pagecount + "</span>");
    pagecount += 1;
});

app.get('/1.html', function (req, res, next) {
    res.send("<h1>section.io Varnish done right</h1>\n<p>Page count: " + pagecount + "</p>");
    pagecount += 1;
});

app.get('/2.html', function (req, res, next) {
    res.send("<h1>section.io Varnish done right</h1>\n<p>Page count: " + pagecount + "</p>");
    pagecount += 1;
});

app.get('/3.html', function (req, res, next) {
    var html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <span id='p'></span></p>\n" +
               "<script src='/assets/js/jquery-3.2.1.min.js'></script>\n" +
               "<script>\n" +
               "$(document).ready(function() {\n" +
               "  $.getJSON('/pagecount', function(data) {\n" +
               "    console.log(data);\n" +
               "    $('#p').html(data.pagecount);\n" +
               "  });\n"+
               "});\n" +
               "</script>";
    res.send(html);
});

app.get('/4.html', function (req, res, next) {
    var html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <span id='p'></span></p>\n" +
               "<script src='/assets/js/jquery-3.2.1.min.js'></script>\n" +
               "<script>\n" +
               "$(document).ready(function() {\n" +
               "  $.getJSON('/pagecount', function(data) {\n" +
               "    console.log(data);\n" +
               "    $('#p').html(data.pagecount);\n" +
               "  });\n"+
               "});\n" +
               "</script>";
    res.send(html);
});

app.get('/5.html', function (req, res, next) {
    var html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <esi:include src='/pagecount-esi'/></p>\n";
    res.send(html);
});

app.get('/6.html', function (req, res, next) {
    var html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <esi:include src='/pagecount-esi'/></p>\n";
    res.send(html);
});

app.get('/7.html', function (req, res, next) {
    var html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <esi:include src='/pagecount-esi-1'/></p>\n";
    res.send(html);
});

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Server started!');
