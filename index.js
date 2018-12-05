require('dotenv').config();
require('newrelic');

const express = require('express');
const { Nuxt, Builder } = require('nuxt')
const port = process.env.PORT || 3000;

const app = express();
const pagecount = 1;

app.get('/pagecount-esi-1', function (req, res, next) {
    res.send("<span id='p'>" + pagecount + "</span>");
    pagecount += 1;
});

// Uncomment this next line to delay all responses by ~2 seconds 
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
    res.send("<!DOCTYPE html>" +
      "<html>"+
        "<head>" +
          '<meta charset="UTF-8">' +
        "</head>" +
        "<body>" +
        "<h1>section.io Varnish done right</h1>\n<p>Page count: " + pagecount + "</p>" +
        "</body>" +
      "</html>"
    );

    pagecount += 1;
});

app.get('/2.html', function (req, res, next) {
    res.send("<h1>section.io Varnish done right</h1>\n<p>Page count: " + pagecount + "</p>");
    pagecount += 1;
});

app.get('/3.html', function (req, res, next) {
    const html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <span id='p'></span></p>\n" +
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
    const html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <span id='p'></span></p>\n" +
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
    const html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <esi:include src='/pagecount-esi'/></p>\n";
    res.send(html);
});

app.get('/6.html', function (req, res, next) {
    const html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <esi:include src='/pagecount-esi'/></p>\n";
    res.send(html);
});

app.get('/7.html', function (req, res, next) {
    const html = "<h1>section.io Varnish done right</h1>\n<p>Page count: <esi:include src='/pagecount-esi-1'/></p>\n";
    res.send(html);
});

app.use(function(req, res, next) {
  console.log("Request headers:", req.headers);
  console.log("Request URL:", req.url);
  next();
});

app.use('/me', express.static(__dirname + '/public'));

const isProd = process.env.NODE_ENV === 'production';
const nuxt = new Nuxt({
    dev: !isProd,
    srcDir: 'nuxt/',
});

if (!isProd) {
    const builder = new Builder(nuxt)
    builder.build()
}

app.use(nuxt.render);

app.listen(port);
console.log('Server started!');
