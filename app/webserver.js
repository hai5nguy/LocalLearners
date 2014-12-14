var express = require('express');
var app = express();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var session = require('express-session');
var Client = require('node-rest-client').Client;

var client = new Client();

var USER_SESSION = {};

//var app = require('http').createServer(app);
//var io = require('socket.io')(server);

app.set('port', (process.env.PORT || 5000));

var MEETUP_KEY = process.env.MEETUP_KEY || 'h0dl8qkd82gbjan5cpr8plb4jq';
var MEETUP_SECRET = process.env.MEETUP_SECRET || 'seagvb265dc9j1vm53q9pvu9r8';


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});



app.use(session({
    secret: 'blah',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://secure.meetup.com/oauth2/authorize',
    tokenURL: 'https://secure.meetup.com/oauth2/access',
    clientID: MEETUP_KEY,
    clientSecret: MEETUP_SECRET,
    callbackURL: 'http://localhost:5000/authenticate/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('accessToken ', accessToken);
        console.log('refreshToken ', refreshToken);
        console.log('profile ', profile.id);
        console.log('done ', done);
        ACCESS_TOKEN = accessToken;
        return done(null, { name: 'blah'}, {});
    })
);

app.get('/authenticate', passport.authenticate('provider'));

app.get('/authenticate/callback',
    passport.authenticate('provider', {
        failureRedirect: '/fail'
    }),
    function (req, res) {
        console.log('blah1');
        USER_SESSION = req.session;
        USER_SESSION.profile = {};
        USER_SESSION.profile = { isAuthenticated: true, accessToken: ACCESS_TOKEN };
        res.redirect('/');
    }
);

app.get('/rest/v1/userprofile', function(req, res) {
    if (USER_SESSION.profile && USER_SESSION.profile.isAuthenticated) {
        //res.json({ name: 'namevalue', accessToken: USER_SESSION.accessToken });

        var args = {
            headers: { Authorization: 'Bearer ' + USER_SESSION.profile.accessToken }
        };
        client.get('https://api.meetup.com/2/member/self?&sign=true&photo-host=public&page=20', args,
            function (data, response) {
                console.log('data ', data.photo);
                //console.log('response', response);
                res.json({ thumb_link: data.photo.thumb_link });
            }
        );

    } else {
        res.json({ error: 'not authenticated' });
    }
});


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
//app.use('/', express.static(__dirname + '/public/index.html'));
app.use(express.static(__dirname + '/public'));





// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).


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

