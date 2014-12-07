var express = require('express');
var app = express();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

//var session = require('express-session');


//var app = require('http').createServer(app);
//var io = require('socket.io')(server);

var MEETUP_KEY = process.env.MEETUP_KEY || 'h0dl8qkd82gbjan5cpr8plb4jq';
var MEETUP_SECRET = process.env.MEETUP_SECRET || 'seagvb265dc9j1vm53q9pvu9r8';


passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://secure.meetup.com/oauth2/authorize',
    tokenURL: 'tokenURL',
    clientID: MEETUP_KEY,
    clientSecret: MEETUP_SECRET,
    callbackURL: 'http://localhost:5000/authorize/callback'
    },
        function(accessToken, refreshToken, profile, done) {
        console.log('accessToken ', accessToken);
        console.log('refreshToken ', refreshToken);
        console.log('profile ', profile);
        console.log('done ', done);
    })
);



app.get('/authorize', passport.authenticate('provider'));

app.get('/authorize/callback',
    passport.authenticate('provider', {
        successRedirect: '/success',
        failureRedirect: '/fail'
    })
);


app.set('port', (process.env.PORT || 5000));

//console.log('testkey', process.env.testkey);
//console.log('testvalue', process.env.testvalue);


//app.get('/test', function(req, res) {
//    res.send('key:' + process.env.testkey + ' value: ' + process.env.testvalue);
//});

//app.get('/authorize',
//    passport.authenticate('meetup'),
//    function (req, res) {
//        //supposedly this is never called
//    });
//
//app.get('/authorize/callback',
//    passport.authenticate('meetup', { failureRedirect: '/fail' }),
//    function(req, res) {
//        res.redirect('/');
//    });


//app.use('/test', express.static(__dirname + '/public/test.html?' + process.env.testkey + '=' + process.env.testvalue));
app.use('/', express.static(__dirname + '/public/index.html'));
app.use(express.static(__dirname + '/public'));
//
//app.use(session({
//    secret: 'keyboard cat',
//    resave: false,
//    saveUninitialized: true
//}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
//app.use(passport.initialize());
//app.use(session());

app.listen(app.get('port'), function() {
    console.log("Web server running on http://localhost:" + app.get('port'));
});


//console.log("dirname: ", __dirname);
//app.use('/bower_components', express.static(__dirname + '/bower_components'));


//io.sockets.on('connection', function(socket) {
//    console.log('user connected');
//    socket.on('message', function(msg) {
//        console.log('heres the fucken message: ', msg);
//    });
//});

