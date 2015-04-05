var Q = require('../node_modules/q');
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

var meetupAdministrator = require('./meetup-administrator.js')(THE_APP);

var _localLearnersGroupId = 18049722;  //todo: move to environmentals, maybe not??
var _localLearnersGroupUrlName = 'locallearners';

module.exports = function (app) {
    return {
        getProfile: getProfile,
        Event: {
            get: Event_get,
            getAll: Event_getAll,
            post: Event_post
        }
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

            console.log('member/self name: ', data.name, '|', data.id);
            var profile = {
                meetupId: data.id,
                name: data.name,
                thumbLink: data.photo ? data.photo.thumb_link : 'http://photos4.meetupstatic.com/img/noPhoto_50.png'
            };
            callback(profile);
        }
    );
}

function Event_getAll() {
    return Q.Promise(function (resolve, reject, notify) {
        restClient.get(MEETUP_API_ENDPOINT + '/events?&sign=true&photo-host=public&fields=event_hosts&group_id=' + _localLearnersGroupId + '&page=20&key=' + LL_ADMINISTRATOR_API_KEY,
            function(data) {
                if (data && data.results) {
                    resolve(data.results);
                } else {
                    reject('Event_getAll - error gettting events');
                }
            }).on('error', function (error) {
                console.log('meetup-api.js Event_getAll error ', error);
                reject(error);
            });
    });
}

function Event_post(req, res, event) {
    return Q.Promise(function (resolve, reject, notify) {
        Q.fcall(checkEventValid(event))
            .then(ensureUserIsEventOrganizer(req, res))
            .then(postEventToMeetup(event))
            .then(function (postedEvent) {
                resolve(postedEvent);
            })
            .catch(reject)
            .done();
    });
    
// 
//
//    if (!isEventValid(event)) defer.reject('Invalid event: ' + JSON.stringify(event))
//
//    ensureUserIsEventOrganizer(req, res).then(
//        function() {
//            var args = {
//                parameters: {
//                    group_id: _localLearnersGroupId,
//                    group_urlname: _localLearnersGroupUrlName,
//                    name: event.name,
//                    time: event.time
//                },
//                headers: {
//                    Authorization: 'Bearer ' + req.session.accessToken
//                }
//            }
//
//            var url = MEETUP_API_ENDPOINT + '/event';
//
////            var url = 'https://api.meetup.com/2/event';
//
//                restClient.post(url, args,
//                function(createdEvent) {
////                    console.log('createdEVent ', createdEvent);
//
//                    if (createdEvent.problem) {
//                        defer.reject(createdEvent);
//                    } else {
//                        defer.resolve(createdEvent);
//                    }
//                })
//                .on('error', function(err) {
//                    defer.reject('Error posting event: ', err);
//                });
//
//        },
//        function() {
//            defer.reject('Error making user id: ', req.user.meetupId, ' an event organizer');
//        }
//    );
//
//    return defer.promise;
}

function checkEventValid(event) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            if ( event &&
                IsPopulatedString(event.name) &&
                IsPopulatedNumber(event.time) ) {

                resolve();
            } else {
                reject('Invalid event ' + JSON.stringify(event));
            }
        });
    }
}


function ensureUserIsEventOrganizer(req, res) {
    
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            
            if (!req.user) reject('User not logged in.');
            
            if (req.user.role == 'Event Organizer') {
                resolve()
            } else {
                promoteUserToEventOrganizer().then(resolve, reject);
            }
        });
    }

    function promoteUserToEventOrganizer() {
        return Q.Promise(function (resolve, reject, notify) {
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
                    var url = 'https://api.meetup.com/2/profile/' + _localLearnersGroupId + '/' + req.user.meetupId;
                    restClient.post(url, args, resolve)
                        .on('error', reject);
                });
        });
    }
}


function Event_get(id) {
    
    return Q.Promise(function (resolve, reject, notify) {
        restClient.get(MEETUP_API_ENDPOINT + '/event/' + id + '?&sign=true&photo-host=public&page=20&key=' + LL_ADMINISTRATOR_API_KEY,
            function(event) {
                resolve(event);
            }).on('error', function (error) {
                reject(error);
            });
    });
    
    /*
     {
     "utc_offset": -14400000,
     "headcount": 0,
     "visibility": "public",
     "waitlist_count": 0,
     "created": 1427846828000,
     "maybe_rsvp_count": 0,
     "event_url": "http://www.meetup.com/LocalLearners/events/221536470/",
     "yes_rsvp_count": 1,
     "announced": false,
     "name": "test class DO NOT RSVP",
     "id": "221536470",
     "time": 1430521200000,
     "updated": 1427846828000,
     "group": {
         "join_mode": "open",
         "created": 1415053890000,
         "name": "Local Learners",
         "group_lon": -86.16000366210938,
         "id": 18049722,
         "urlname": "LocalLearners",
         "group_lat": 39.77000045776367,
         "who": "Learners"
     },
     "status": "upcoming"
     }
     */
    
    
    
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



