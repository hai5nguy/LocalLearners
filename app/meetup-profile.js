var meetupAPI = require('./meetup-api.js')(THE_APP);

module.exports.getProfile = function (accessToken, callback) {
    meetupAPI.getSelf(accessToken, function(profile) {
        callback(profile);
    });
}

