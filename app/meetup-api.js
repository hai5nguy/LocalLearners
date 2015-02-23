var q = require('../node_modules/q');
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

var meetupAdministrator = require('./meetup-administrator.js')(APP);

var LOCAL_LEARNERS_GROUP_ID = 18049722;
var LOCAL_LEARNERS_GROUP_URLNAME = 'locallearners';
var LOCAL_LEARNERS_ADMINISTRATOR_API_KEY = '7d156b614b6d5c5e7d357e18151568';

module.exports = function (APP) {

    return {
        getSelf: getSelf,
        getEvents: getEvents,
        postEvent: postEvent,
        changeUserRole: changeUserRole
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSelf(accessToken, callback) {

    var args = {
        headers: { Authorization: 'Bearer ' + accessToken }
    };

    restClient.get('https://api.meetup.com/2/member/self?&sign=true&photo-host=public&page=20', args,
        function (data) {
            var profile = {
                mid: data.id,
//                accessToken: accessToken,  !!!accessToken should never be sent to client side
                thumb_link: data.photo ? data.photo.thumb_link : 'na'
            };
            callback(profile);
        }
    );
}

function getEvents(req, res) {
    var defer = q.defer();

    restClient.get(MEETUP_API_ENDPOINT + '/events?&sign=true&photo-host=public&group_id=' + LOCAL_LEARNERS_GROUP_ID + '&page=20&key=' + LOCAL_LEARNERS_ADMINISTRATOR_API_KEY,
        function(data) {
            var rawEvents = data.results;
            var events = [];
            for (var i = 0; i < rawEvents.length; i++) {
                var e = {
                    eventId: rawEvents[i].id,
                    name: rawEvents[i].name
                }
                events.push(e);
            }
            defer.resolve(events);
        }).on('error', function (err) {
            console.log('meetup-api.js getEvents error ', err);
            defer.reject();
        });

    return defer.promise;
}

function postEvent(req, res, event) {

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
            Authorization: 'Bearer ' + req.session.accessToken
            //'Content-Type': 'APPlication/x-www-form-urlencoded'
        }
    }


//    restClient.post('https://api.meetup.com/2/event', args,
//        function(createdEvent) {
//            console.log('createdEVent ', createdEvent);
//
//            if (createdEvent.problem) {
//                defer.reject(createdEvent);
//            } else {
//                defer.resolve(createdEvent);
//            }
//        })
//        .on('error', function(err) {
//            defer.reject(err);
//        });

//    defer.resolve(createFakeEvent());


    return defer.promise;
}

function changeUserRole(req, res, role) {
    var defer = q.defer();


    meetupAdministrator.getAdministratorAccessToken()
        .then(function (token) {
            var args = {
                parameters: {
                    add_role: role
                },
                headers: {
                    Authorization: 'Bearer ' + token
                    //'Content-Type': 'APPlication/x-www-form-urlencoded'
                }
            };

            console.log('111 ', 'https://api.meetup.com/2/profile/' + LOCAL_LEARNERS_GROUP_ID + '/' + req.session.profile.mid + '?&sign=true');

            restClient.post('https://api.meetup.com/2/profile/' + LOCAL_LEARNERS_GROUP_ID + '/' + req.session.profile.mid,
                args, function (a, b, c) {
                    console.log('a ', a);
                    console.log('c ', c);

                    defer.resolve();
                }).on('error', function(err) {
                    defer.reject(err);
                });

        })

    return defer.promise;

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isEventValid(event) {
    if (!event) return false;
    if (!event.name || event.name === '') return false;
    //TODO: need to check event.time
    return true;
}