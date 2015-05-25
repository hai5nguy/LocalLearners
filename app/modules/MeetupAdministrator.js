var Q           = require(LL_NODE_MODULES_DIR + 'q');
var Browser     = require(LL_NODE_MODULES_DIR + 'zombie');

var RestService = require(LL_MODULES_DIR + 'RestService.js');

var _localLeanersAdministratorAccessCode;
var _localLeanersAdministratorAccessToken;

var MeetupAdministrator = (function () {
    registerAdministratorServerCallback();

    return {
        getAccessToken: CONTEXTPROMISE(getAccessToken)
    };

})();

function getAccessToken(context, resolve, reject, notify) {
    //TODO: account in expired time;

    if (_localLeanersAdministratorAccessToken) {
        context.MeetupAdministrator.accessToken = _localLeanersAdministratorAccessToken;
        resolve();
    } else {
        authorizeLocalLearnersAdministratorWithMeetup(context);
        globalEventEmitter.on(EMITTEREVENTS.AdministratorAccessTokenAcquired, function (token) {
            context.MeetupAdministrator.accessToken = _localLeanersAdministratorAccessToken = token;
            resolve();
        });
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Public Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Private Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

function authorizeLocalLearnersAdministratorWithMeetup() {
    var browser = new Browser();

    var url = MEETUP_API_URL.AUTHORIZE +
        '?client_id=' + LL_ADMINISTRATOR_CONSUMER_KEY +
        '&response_type=code' +
        '&redirect_uri=' + LL_ADMINISTRATOR_REDIRECT_URL;

    browser.visit(url)
        .then(function() {
            console.log('title of first meetup login form: ', browser.text('title'));
            browser.fill('email', LL_ADMINISTRATOR_EMAIL);
            browser.fill('password', LL_ADMINISTRATOR_PASSWORD);
            return browser.pressButton('input[name=submitButton]');
        })
        .then(function() {
            console.log('title of second meetup login form: ', browser.text('title'));
        });
}

function registerAdministratorServerCallback() {
    
    THE_APP.get('/meetupServerLinkCallback', function (req, res) {
        _localLeanersAdministratorAccessCode = req.query.code;

        var context = new CONTEXT();

        context.RestService = {
            url: MEETUP_API_URL.ACCESS,
            args: {
                parameters: {
                    client_id: LL_ADMINISTRATOR_CONSUMER_KEY,
                    client_secret: LL_ADMINISTRATOR_CONSUMER_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: LL_ADMINISTRATOR_REDIRECT_URL,
                    code: _localLeanersAdministratorAccessCode
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        };
    
        RestService.post(context)().then(function () {
            //TODO: handle errors
            globalEventEmitter.emit(EMITTEREVENTS.AdministratorAccessTokenAcquired, context.RestService.result.access_token);
            res.send('');
    	}, function () {
            console.error("oh sh*t f*@k morty, this is serious, tell hai ", context);
            res.status(500).send('');
        });
    });
}

module.exports = MeetupAdministrator;