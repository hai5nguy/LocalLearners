var meetupAPI = require('./meetup-api.js');

module.exports.getProfile = function (accessToken, callback) {
    meetupAPI.getSelf(accessToken, function(profile) {
        callback(profile);
    });
}

