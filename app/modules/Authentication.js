var Q               = require(LL_NODE_MODULES_DIR + 'q');
var passport        = require(LL_NODE_MODULES_DIR + 'passport');
var OAuth2Strategy  = require(LL_NODE_MODULES_DIR + 'passport-oauth').OAuth2Strategy;
var session         = require(LL_NODE_MODULES_DIR + 'express-session');
var cookieParser    = require(LL_NODE_MODULES_DIR + 'cookie-parser');
var bodyParser      = require(LL_NODE_MODULES_DIR + 'body-parser');
var MongoStore      = require(LL_NODE_MODULES_DIR + 'connect-mongo')(session);

var MeetupApi       = require(LL_MODULES_DIR + 'MeetupApi.js');
var Database        = require(LL_MODULES_DIR + 'Database.js');

var Authentication = (function () {
    setupPassport();
    setAuthenticationRoutes();

    return {
        ensureAuthenticated: ensureAuthenticated
    };
})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        debug(FUNCTIONALITY.Authentication_ensureAuthenticated, { req: req, res: res, next: next });
        return res.sendStatus(401);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setupPassport() {
    var app = THE_APP;
    app.use(cookieParser());
    app.use(bodyParser.json());       	// to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        var context = { user: { query: { _id: id } } };
        
        Database.User.get(context)().then(function (context) {
            done(null, context.user);
        }, function (context) {
            debug(FUNCTIONALITY.Authentication_deserializeUser, { context: context });
            done(null, false);
        });
    });

    app.use(session({
        secret: LL_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            url: LL_MONGODB_CONNECTION_STRING
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    var strategy = new OAuth2Strategy({
        authorizationURL: MEETUP_API_URL.AUTHORIZATION,
        tokenURL: MEETUP_API_URL.ACCESSTOKEN,
        clientID: LL_MEETUP_OAUTH2_CLIENTID,
        clientSecret: LL_MEETUP_OAUTH2_SECRET,
        callbackURL: LL_MEETUP_OAUTH2_CALLBACKURL
    }, authenticationHandler);
    
    passport.use('provider', strategy);
    
}

function authenticationHandler(accessToken, refreshToken, profile, done) {
    
    var context = {
        user: {
            accessToken: accessToken
        }
    };
    
    Q.fcall(MeetupApi.Profile.get(context))
        .then(function() {
            context.user.query = { 'meetupProfile.id': context.user.meetupProfile.id };
        })
        .then(Database.User.upsert(context))
        .then(function () {
            done(null, context.user);
        })
        .catch(function () {
            debug(FUNCTIONALITY.authentication, 'authenticationHandler', { context: context });
        })
        .done();
}

function setAuthenticationRoutes() {
    var app = THE_APP;
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
}


module.exports = Authentication;