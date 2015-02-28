var Q = require('../node_modules/q');
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

var meetupAdministrator = require('./meetup-administrator.js')(THE_APP);

var LOCAL_LEARNERS_GROUP_ID = 18049722;
var LOCAL_LEARNERS_GROUP_URLNAME = 'locallearners';
var LOCAL_LEARNERS_ADMINISTRATOR_API_KEY = '7d156b614b6d5c5e7d357e18151568';

module.exports = function (app) {
    return {
        getProfile: getProfile,
        getEvents: getEvents,
        postEvent: postEvent
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getProfile(accessToken, callback) {

    var args = {
        headers: { Authorization: 'Bearer ' + accessToken }
    };

    restClient.get('https://api.meetup.com/2/member/self?&sign=true&photo-host=public&page=20', args,
        function (data) {
            var profile = {
                mid: data.id,
                thumb_link: data.photo ? data.photo.thumb_link : 'http://photos4.meetupstatic.com/img/noPhoto_50.png'
            };
            callback(profile);
        }
    );
}

function getEvents(req, res) {
    var defer = Q.defer();

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

    if (!isEventValid(event)) defer.reject('Invalid event: ' + JSON.stringify(event))

    ensureUserIsEventOrganizer(req, res).then(
        function() {
            var args = {
                parameters: {
                    group_id: LOCAL_LEARNERS_GROUP_ID,
                    group_urlname: LOCAL_LEARNERS_GROUP_URLNAME,
                    name: event.name,
                    time: event.time
                },
                headers: {
                    Authorization: 'Bearer ' + req.session.accessToken
                }
            }

//            var url = MEETUP_API_ENDPOINT + '/event';

            var url = 'https://api.meetup.com/2/event';


                restClient.post(url, args,
                function(createdEvent) {
                    console.log('createdEVent ', createdEvent);

                    if (createdEvent.problem) {
                        defer.reject(createdEvent);
                    } else {
                        defer.resolve(createdEvent);
                    }
                })
                .on('error', function(err) {
                    defer.reject('Error posting event: ', err);
                });

        },
        function() {
            defer.reject('Error making user id: ', req.session.profile.mid, ' an event organizer');
        }
    );

    return defer.promise;
}

function ensureUserIsEventOrganizer(req, res) {
    var defer = Q.defer();
    var args = {
        headers: {
            Authorization: 'Bearer ' + req.session.accessToken
        }
    };
    var url = 'https://api.meetup.com/2/profile/' + LOCAL_LEARNERS_GROUP_ID + '/' + req.session.profile.mid;

    restClient.get(url, args, function(meetupProfile) {

        if (meetupProfile.role == 'Event Organizer') {
            defer.resolve();
        } else {
            promoteUserToEventOrganizer(req, res).then(defer.resolve, defer.reject);
        }
    });
    return defer.promise;
}

function promoteUserToEventOrganizer(req, res) {
    var defer = Q.defer();
    meetupAdministrator.getAdministratorAccessToken()
        .then(function (token) {
            var args = {
                parameters: {
                    add_role: 'event_organizer'
                },
                headers: {
                    Authorization: 'Bearer ' + token
                }
            };
            var url = 'https://api.meetup.com/2/profile/' + LOCAL_LEARNERS_GROUP_ID + '/' + req.session.profile.mid;
            restClient.post(url, args, defer.resolve)
                .on('error', defer.reject);
        });
    return defer.promise;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isEventValid(event) {
    return (
        event &&
        IsPopulatedString(event.name) &&
        IsPopulatedNumber(event.time)
    )
}

//function doGet(options) {
//    var defer = Q.defer();
//
//
//
//    var args = {
//        parameters: {}
//    }
//    var args = {
//        parameters: {
//            add_role: role
//        },
//        headers: {
//            Authorization: 'Bearer ' + token
//            //'Content-Type': 'APPlication/x-www-form-urlencoded'
//        }
//    };
//
//    if (!options.url || options.url === '') throw 'doGet url invalid';
//
//    if (options.parameters) args.parameters = options.parameters;
//    if (options.headers) args.headers = options.headers;
//
//    if (!options.excludeAccessToken) {
//        args.headers.Authorization = 'Bearer '
//    }
//    restClient.get(options.url, )
//}