require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

let failover_flag = true;

app.get('/1', function (req, res, next) {
    res.set('Cache-control', 'public, max-age=300');
    res.send({
        data: "Hello"
    });
});

app.get('/2', function (req, res, next) {
    if (failover_flag) {
        res.json({ error: 'true' })
    }else{
        res.send({
            data: "Hello World 2"
        });
    }
});

app.get('/3', function (req, res, next) {
    if (failover_flag) {
        res.sendStatus(500);
    }else{
        res.send({
            data: "Hello World 3"
        });
    }
});

app.get('/4', function (req, res, next) {
    if (failover_flag) {
        setTimeout( function() {
            res.send({
                data: "Hello timeout"
            });
        }, 10000);
    }else{
        res.send({
            data: "Hello World 4"
        });
    }
});

app.get('/triggerfail', (req, resp) => {
    failover_flag = !failover_flag;
    resp.send("OK");
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
