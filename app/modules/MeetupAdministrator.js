var Q       = require(LL_NODE_MODULES_DIR + 'q');
var Browser = require(LL_NODE_MODULES_DIR + 'zombie');

//var restClient  = require(LL_NODE_MODULES_DIR + 'node-rest-client').Client();

var _localLeanersAdministratorAccessCode;
var _localLeanersAdministratorAccessToken;

var _meetupApiAuthorizeUrl = 'https://secure.meetup.com/oauth2/authorize';

var MeetupAdministrator = (function () {
    registerAdministratorServerCallback();

    return {
        getAccessToken: CONTEXTPROMISE(getAccessToken)
    };

})();

function getAccessToken(context, resolve, reject, notify) {
    
    //TODO: account in expired time;

    if (_localLeanersAdministratorAccessToken) {
        resolve(_localLeanersAdministratorAccessToken);
    } else {
        authorizeLocalLearnersAdministratorWithMeetup();
        globalEventEmitter.on(EMITTEREVENTS.AdministratorAccessTokenAcquired, function (accessToken) {
            console.log('administrator accesss token ', accessToken);
            resolve(accessToken);
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
    const browser = new Browser();

    var url = _meetupApiAuthorizeUrl +
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

    var app = THE_APP;
    
    app.get('/meetupServerLinkCallback', function (req, res) {
        _localLeanersAdministratorAccessCode = req.query.code;

        var url = 'https://secure.meetup.com/oauth2/access';

        var args = {
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

        restClient.post(url, args, function (response) {
            //TODO: handle errors
            _localLeanersAdministratorAccessToken = response.access_token
            globalEventEmitter.emit(EMITTEREVENTS.AdministratorAccessTokenAcquired, _localLeanersAdministratorAccessToken);
            res.send('');
        });
    });
}

module.exports = MeetupAdministrator;