var meetupAPI = require('./meetup-api.js')(APP);

module.exports.getProfile = function (accessToken, callback) {
    meetupAPI.getSelf(accessToken, function(profile) {
        callback(profile);
    });
}

