require('./core.js');

var express = require('express');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var session = require('express-session');
var Client = require('node-rest-client').Client;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);


var meetupProfile = require('./meetup-profile.js');

var meetupApi = require('./meetup-api.js');


var app = express();

var client = new Client();

app.set('port', (process.env.PORT || 5000));

app.use(cookieParser());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

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
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa'
    })
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
        return done(null, { accessToken: accessToken }, {} );
    })
);

app.get('/authenticate', passport.authenticate('provider'));

app.get('/authenticate/callback',
    passport.authenticate('provider', {
        failureRedirect: '/fail'
    }),
    function (req, res) {

        req.session.accessToken = req.user.accessToken;

        meetupProfile.getProfile(req.session.accessToken, function(profile) {
            req.session.profile = profile;
            res.redirect('/');
        });

    }
);

app.get('/test', function (req, res) {
//    var blah = { yo: 'yos', id: req.params.id };
    meetupApi.getEvents(req, res, function() {});
    //res.json(blah);
});

app.use(express.static(__dirname + '/public'));

require('./routes/routes.js')(app);

app.listen(app.get('port'), function() {
    console.log("Web server running on http://localhost:" + app.get('port'));
});


