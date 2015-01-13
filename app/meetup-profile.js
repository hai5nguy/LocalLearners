/* module responsible for getting account/profile information from meetup */
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

var getProfile = function(accessToken, callback) {

    var args = {
        headers: { Authorization: 'Bearer ' + accessToken }
    };

    restClient.get('https://api.meetup.com/2/member/self?&sign=true&photo-host=public&page=20', args,
        function (data) {
            console.log('member self data ', data);
            var profile = {
                userId: data.id,
//                accessToken: accessToken,
                thumb_link: data.photo.thumb_link
            };
            callback(profile);
        }
    );
}

module.exports.getProfile = getProfile;