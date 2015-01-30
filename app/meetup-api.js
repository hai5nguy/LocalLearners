
var Q = require('../node_modules/q');
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

var LOCAL_LEARNERS_GROUP_ID = 18049722;
var LOCAL_LEARNERS_GROUP_URLNAME = 'locallearners';

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

module.exports.getEvents = function (req, res) {
    var defer = Q.defer();

    var localLearnersAdministratorAPIKey = '7d156b614b6d5c5e7d357e18151568';  //TODO: move to environment variable


    restClient.get('https://api.meetup.com/2/events?&sign=true&photo-host=public&group_id=' + LOCAL_LEARNERS_GROUP_ID + '&page=20&key=' + localLearnersAdministratorAPIKey,
        function(data) {
//            console.log('getEvent data ', data);
            var rawEvents = data.results;
            var events = [];

            for (var i = 0; i < rawEvents.length; i++) {
                var e = {
                    eventId: rawEvents[i].id,
                    name: rawEvents[i].name
                }
                events.push(e);
            }
//            console.log('getEvents ', events);

            defer.resolve(events);
        }).on('error', function (err) {
            console.log('getEvents error ', err);
            defer.reject();
        });

    return defer.promise;
}

module.exports.postEvent = function (req, res, event) {

    var defer = Q.defer();

    if (!isEventValid(event)) {
        defer.reject('Invalid event: ' + JSON.stringify(event))
    }

    var args = {
        parameters: {
            group_id: LOCAL_LEARNERS_GROUP_ID,
            group_urlname: LOCAL_LEARNERS_GROUP_URLNAME,
            name: event.name,
            time: event.time
        },
        headers: {
            Authorization: 'Bearer ' + req.session.accessToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    restClient.post('https://api.meetup.com/2/event', args,
        function(data) {
            console.log('data ', data);
            defer.resolve('blah');
        });

    return defer.promise;
}

function isEventValid(event) {
    if (!event) return false;
    if (!event.name || event.name === '') return false;
    //TODO: need to check event.time
    return true;
}