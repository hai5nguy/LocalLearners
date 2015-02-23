var q = require('../node_modules/q');

const Browser = require('zombie');
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();


var _localLearnersAdministratorConsumerKey = 'q4kmd7td3041urie6bodfc1ljm';
var _localLearnersAdministratorConsumerSecret = '4l2hdci02qgc4svjpu97h5tl04';
var _localLearnersAdministratorRedirectUrl = 'http://localhost:5000/meetupServerLinkCallback';

var _localLeanersAdministratorAccessCode;
var _localLeanersAdministratorAccessToken;

module.exports = function (app) {
    registerAdministratorServerCallback(app);
    return {
        getAdministratorAccessToken: getAdministratorAccessToken
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAdministratorAccessToken() {
    var defer = q.defer();

    //TODO: account in expired time;

    if (_localLeanersAdministratorAccessToken) {
        defer.resolve(_localLeanersAdministratorAccessToken);
    } else {
        authorizeLocalLearnersAdministratorWithMeetup();
        globalEventEmitter.on('AdministratorAccessTokenAcquired', function (accessToken) {
            console.log('administrator accesss token ', accessToken);
            defer.resolve(accessToken);
        });
    }

    return defer.promise;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function authorizeLocalLearnersAdministratorWithMeetup() {
    const browser = new Browser();

    var url = 'https://secure.meetup.com/oauth2/authorize' +
        '?client_id=' + _localLearnersAdministratorConsumerKey +
        '&response_type=code' +
        '&redirect_uri=' + _localLearnersAdministratorRedirectUrl;

//    console.log(url);

    browser.visit(url)
        .then(function() {
            console.log('title of first meetup login form: ', browser.text('title'));
            browser.fill('email', 'locallearnersmeetup@gmail.com');
            browser.fill('password', 'thirstyscholar1');
            return browser.pressButton('input[name=submitButton]');
        })
        .then(function() {
            console.log('title of second meetup login form: ', browser.text('title'));
        });
}

function registerAdministratorServerCallback(app) {

    app.get('/meetupServerLinkCallback', function (req, res) {
        _localLeanersAdministratorAccessCode = req.query.code;

        var url = 'https://secure.meetup.com/oauth2/access';

        var args = {
            parameters: {
                client_id: _localLearnersAdministratorConsumerKey,
                client_secret: _localLearnersAdministratorConsumerSecret,
                grant_type: 'authorization_code',
                redirect_uri: _localLearnersAdministratorRedirectUrl,
                code: _localLeanersAdministratorAccessCode
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        restClient.post(url, args, function (response) {
            //TODO: handle errors
            _localLeanersAdministratorAccessToken = response.access_token
            globalEventEmitter.emit('AdministratorAccessTokenAcquired', _localLeanersAdministratorAccessToken);
            res.send('');
        });


    });
}