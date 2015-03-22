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
        db.getUser({ _id : id }).then(function (user) {
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

    passport.use(
        'provider', 
        new OAuth2Strategy({
            authorizationURL: 'https://secure.meetup.com/oauth2/authorize',
            tokenURL: 'https://secure.meetup.com/oauth2/access',
            clientID: LL_MEETUP_OAUTH2_CLIENTID,
            clientSecret: LL_MEETUP_OAUTH2_SECRET,
            callbackURL: 'http://localhost:5000/authenticate/callback'
        }, function(accessToken, refreshToken, profile, done) {

            meetupApi.getProfile(accessToken, function(profile) {

                var query = {
                    meetupId: profile.meetupId
                };
                var user = {
                    meetupId: profile.meetupId,
                    name: profile.name,
                    accessToken: accessToken,
                    thumbLink: profile.thumbLink
                };
                db.upsertUser(query, user).then(function (user) {
                    done(null, user) 
                }, function (err) {
                    console.error('Authentication passport error, unable to upsert user, err: ', err);
                });

            });
        })
    );

    //
    //passport.use(new google_strategy({
    //		clientID: '442704851010.apps.googleusercontent.com',
    //		clientSecret: 'uRQL8HQ7zmf_yyfDoyUL1_eZ',
    //		callbackURL: 'http://devbox.example.com:3000/auth/google/callback'
    //	},
    //	function(accessToken, refreshToken, profile, done) {
    //		UserDB.findOne({email: profile._json.email},function(err,usr) {
    //			usr.token = accessToken;
    //			usr.save(function(err,usr,num) {
    //				if(err) {
    //					console.log('error saving token');
    //				}
    //			});
    //			process.nextTick(function() {
    //				return done(null,profile);
    //			});
    //		});
    //	}
    //));
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

