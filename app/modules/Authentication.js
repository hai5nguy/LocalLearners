var Q               = require(LL_NODE_MODULES_DIR + 'q');
var passport        = require(LL_NODE_MODULES_DIR + 'passport');
var OAuth2Strategy  = require(LL_NODE_MODULES_DIR + 'passport-oauth').OAuth2Strategy;
var session         = require(LL_NODE_MODULES_DIR + 'express-session');
var cookieParser    = require(LL_NODE_MODULES_DIR + 'cookie-parser');
var bodyParser      = require(LL_NODE_MODULES_DIR + 'body-parser');
var MongoStore      = require(LL_NODE_MODULES_DIR + 'connect-mongo')(session);

var MeetupApi       = require(LL_MODULES_DIR + 'Meetup.js');
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
        return res.status(401).send({ message: 'Not Authorized'});
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
        var context = new CONTEXT();
        context.Database = { query: { _id: id } };
        
        Database.User.get(context)().then(function () {
            done(null, context.Authentication.user);
        }, function () {
            d('serious authentication failure', context);
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
        authorizationURL: MEETUP_API_URL.AUTHORIZE,
        tokenURL: MEETUP_API_URL.ACCESS,
        clientID: LL_MEETUP_OAUTH2_CLIENTID,
        clientSecret: LL_MEETUP_OAUTH2_SECRET,
        callbackURL: LL_MEETUP_OAUTH2_CALLBACKURL
    }, authenticationCallbackHandler);
    
    passport.use('provider', strategy);
    
}

function authenticationCallbackHandler(accessToken, refreshToken, profile, done) {
    debug(FUNCTIONALITY.authentication, 'authenticationCallbackHandler', { accessToken: accessToken, refreshToken: refreshToken, profile: profile, done: done });
    
    var context = new CONTEXT();
    context.Authentication = {
        user: {
            accessToken: accessToken
        }
    };
    
    Q.fcall(MeetupApi.Profile.get(context))
        .then(function() {
            context.Database = {
                query: { 'meetupProfile.id': context.Authentication.user.meetupProfile.id }
            };
        })
        .then(Database.User.upsert(context))
        .then(function () {
            done(null, context.Authentication.user);
        })
        .catch(function () {
            debug(FUNCTIONALITY.authentication, 'authenticationCallbackHandler error!!!!!!!!! tell hai', { context: context });
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