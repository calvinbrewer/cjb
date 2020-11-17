require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

let pagecount = 1;

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

app.get('/account', function (req, res, next) {
    const { session } = req.cookies;

    if (session === "helloworld") {
        res.send("You are logged in!");
    }

    res.redirect("/login.html");
})

app.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    console.log(req.body);

    if (username === "test" && password === "helloworld") {
        res.cookie('session', "helloworld", {maxAge: 10800});
        res.redirect('/account');
    }

    res.sendStatus(401);
});

app.use(function(req, res, next) {
    console.log("Request headers:", req.headers);
    console.log("Request URL:", req.url);
    next();
});

app.post('/drift-test', function(req, res, next) {
    console.log("Request Body:", req.body);
    res.send("Cool that worked.");
});

app.use('/nuxt', express.static(__dirname + '/dist'));
app.use('/', express.static(__dirname + '/public'));

app.listen(port);
console.log('Server started!');
