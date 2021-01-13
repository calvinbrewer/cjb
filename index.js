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
        `<script>window.intercomSettings = {app_id: "de5zdti6"};</script><script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/de5zdti6';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();</script>` +
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

app.get('/unhealthy', function(req, res) {
    res.send(503);
});

app.get('/unhealthytimeout', function(req, res) {
    setTimeout( function() {
        res.send(503);
    }, 120000);
});

app.get('/healthcheck', function(req, res) {
    res.send(200);
});

app.use('/nuxt', express.static(__dirname + '/dist'));
app.use('/', express.static(__dirname + '/public'));

app.listen(port);
console.log('Server started!');
