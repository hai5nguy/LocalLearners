var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

module.exports.getSelf = function (accessToken, callback) {

    var args = {
        headers: { Authorization: 'Bearer ' + accessToken }
    };

    restClient.get('https://api.meetup.com/2/member/self?&sign=true&photo-host=public&page=20', args,
        function (data) {

            var profile = {
                userId: data.id,
//                accessToken: accessToken,  !!!accessToken should never be sent to client side
                thumb_link: data.photo.thumb_link
            };
            callback(profile);
        }
    );
}

module.exports.getEvents = function (req, res, callback) {

    var localLearnersGroupId = 18049722;

    var args = {
        headers: { Authorization: 'Bearer ' + req.session.accessToken }
    };

    restClient.get('https://api.meetup.com/2/events?&sign=true&photo-host=public&group_id=' + localLearnersGroupId + '&page=20',
        args, function(data) {
            callback(data);
        });


}