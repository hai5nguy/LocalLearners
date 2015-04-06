var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var meetupApi = require('./meetup-api.js')(THE_APP);
var db = require('./db.js')(THE_APP);

module.exports = function (app) {
    setupPassport(app);
    setAuthenticationRoutes(app);

    return {
        ensureAuthenticated: ensureAuthenticated
    };
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('ensureAuthenticated fail for: ', req.method, ' ', req.originalUrl);
        return res.sendStatus(401);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setupPassport(app) {
    app.use(cookieParser());
    app.use(bodyParser.json());       	// to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        db.User.get({ _id : id }).then(function (user) {
            done(null, user);
        }, function (err) {
            console.log('passport.deserializeUser error: ', JSON.stringify(err));
            done(null, false);
        });
    });

    app.use(session({
        secret: 'blah',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            url: LL_MONGODB_CONNECTION_STRING
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    var strategy = new OAuth2Strategy({
        authorizationURL: 'https://secure.meetup.com/oauth2/authorize',
        tokenURL: 'https://secure.meetup.com/oauth2/access',
        clientID: LL_MEETUP_OAUTH2_CLIENTID,
        clientSecret: LL_MEETUP_OAUTH2_SECRET,
        callbackURL: 'http://localhost:5000/authenticate/callback'
    }, authenticationHandler);
    
    passport.use('provider', strategy);
    
}

function authenticationHandler(accessToken, refreshToken, profile, done) {
    meetupApi.Profile.get(accessToken).then(function (profile) {
        var query = {
            meetupProfile: {
                id: profile.id
            }
        };
        var user = {
            meetupProfile: profile,
            accessToken: accessToken
        };

        db.User.upsert(query, user).then(function (user) {
            done(null, user);
        }, function (error) {
            console.error('Authentication passport error, unable to upsert user, err: ', error);
        });

    }, function (error) {
        console.error('Unable to get user profile: ', error);
    });
}

function setAuthenticationRoutes(app) {

    app.get('/login', passport.authenticate('provider'));

    app.get('/logout', function (req, res) {
        req.logout();
        res.json( { message: 'success' });
    });

    app.get('/authenticate/callback',
        passport.authenticate('provider', {
            failureRedirect: '/fail'
        }),
        function (req, res) {
            res.redirect('/');
        });
    
    /*

     http://docs.mongodb.org/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify
     */
}



/*
 {
 "country": "us",
 "city": "Indianapolis",
 "topics": [
 {
 "urlkey": "movies",
 "name": "Watching Movies",
 "id": 1201
 }
 ],
 "joined": 1363530155000,
 "link": "http://www.meetup.com/members/85189222",
 "photo": {
 "highres_link": "http://photos3.meetupstatic.com/photos/member/2/c/3/c/highres_241631324.jpeg",
 "photo_id": 241631324,
 "photo_link": "http://photos1.meetupstatic.com/photos/member/2/c/3/c/member_241631324.jpeg",
 "thumb_link": "http://photos3.meetupstatic.com/photos/member/2/c/3/c/thumb_241631324.jpeg"
 },
 "lon": -86.2699966430664,
 "other_services": { },
 "name": "Hai Nguyen",
 "visited": 1428281697000,
 "self": {
 "common": { }
 },
 "id": 85189222,
 "state": "IN",
 "lang": "en_US",
 "lat": 39.84000015258789,
 "status": "active"
 }
 */