var Q = require('../node_modules/q');
var NodeRestClient = require('node-rest-client').Client;
var restClient = new NodeRestClient();

var meetupAdministrator = require('./meetup-administrator.js')(THE_APP);

var _localLearnersGroupId = 18049722;  //todo: move to environmentals, maybe not??
var _localLearnersGroupUrlName = 'locallearners';

module.exports = function (app) {
    return {
        Event: {
            get: Event_get,
            getAll: Event_getAll,
            post: Event_post
        },
        Profile: {
            get: Profile_get
        },
        RSVP: {
            get: RSVP_get,
            update: RSVP_update
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Profile_get(accessToken) {
    return Q.Promise(function (resolve, reject, notify) {
        var args = {
            headers: { Authorization: 'Bearer ' + accessToken }
        };
        restClient.get('https://api.meetup.com/2/member/self?&sign=true&photo-host=public&page=20', args, function (meetupProfile) {
            debug(FUNCTIONALITY.meetup_api_profile_get, 'meetup api Profile_get', meetupProfile);
            if (!meetupProfile.photo) { 
                meetupProfile.photo = {};
                meetupProfile.photo.thumb_link = 'http://photos4.meetupstatic.com/img/noPhoto_50.png'
            }
            resolve(meetupProfile);
        }).on('error', function (error) {
            console.log('Profile_get error ', error);
            reject(error);
        });
    });
}
//https://api.meetup.com/2/rsvps?&sign=true&photo-host=public&event_id=222028697&page=20
function RSVP_get(eventId) {
    return Q.Promise(function (resolve, reject, notify) {
        
        var url = MEETUP_API_ENDPOINT + '/rsvps?&sign=true&photo-host=public&event_id=' + eventId + '&page=20&key=' + LL_ADMINISTRATOR_API_KEY;
        restClient.get(url, function (response) {
            debug(FUNCTIONALITY.meetup_api_RSVP_get, 'RSVP_get', { eventId: eventId, response: response });
            resolve({});
        }).on('error', function (error) {
            debug(FUNCTIONALITY.meetup_api_RSVP_get, 'RSVP_get error', { eventId: eventId, error: error });
            reject(error);
        });
        
    });  
}

function RSVP_update(req, args) {
    return Q.Promise(function (resolve, reject, notify) {
        
        var url = MEETUP_API_ENDPOINT + '/rsvp';
        var postData = {
            parameters: {
                event_id: args.eventId ,
                rsvp: args.isAttending ? 'yes' : 'no'
            },
            headers: {
                Authorization: 'Bearer ' + req.user.accessToken
            }
        };

        restClient.post(url, postData, function (rsvpResult) {
            console.log('11111111 rsvp result =============================');
            console.log(rsvpResult);
            
            resolve();
        });
    });
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


///////////////////////////////////////////////////////////////////////////////////////

function Event_post(req, res, event) {
    debug(FUNCTIONALITY.meetup_api_Event_post, 'event arg', event);
    return Q.Promise(function (resolve, reject, notify) {
        
        Q.fcall(_checkEventValid(event))
            .then(_ensureUserIsEventOrganizer(req, res))
            .then(_postViaRestClient(req, res, event))
            .then(function (postedEvent) {
                resolve(postedEvent);
            })
            .catch(reject)
            .done();
    });
    
}

function _checkEventValid(event) {
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

function _ensureUserIsEventOrganizer(req, res) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            if (!req.user) reject('User not logged in.');
            
            _getUserMeetupRole(req).then(function (role) {
                debug(FUNCTIONALITY.meetup_api_Event_post, '_ensureUserIsEventOrganizer role return', role)
                if (role === 'Event Organizer' || role === 'Organizer') {
                    resolve();
                } else {
                    _promoteUserToEventOrganizer(req, res).then(resolve, reject);
                }
            });
        });
    }
}

function _getUserMeetupRole(req) {
    return Q.Promise(function (resolve, reject, notify) {
        var args = {
            headers: {
                Authorization: 'Bearer ' + req.user.accessToken
            }
        };
        var url = 'https://api.meetup.com/2/profile/' + _localLearnersGroupId + '/' + req.user.meetupProfile.id;

        restClient.get(url, args, function(meetupProfile) {
            debug(FUNCTIONALITY.meetup_api_Event_post, '_getUserMeetupRole meetupProfile return', meetupProfile);
            resolve(meetupProfile.role);
        }).on('error', function (error) {
            reject(error);
        });
    });
}

function _promoteUserToEventOrganizer(req) {
    return Q.Promise(function (resolve, reject, notify) {
        meetupAdministrator.getAdministratorAccessToken().then(function (token) {
            var args = {
                parameters: {
                    add_role: 'event_organizer'
                },
                headers: {
                    Authorization: 'Bearer ' + token
                }
            };
            
            var url = 'https://api.meetup.com/2/profile/' + _localLearnersGroupId + '/' + req.user.meetupProfile.id;
            restClient.post(url, args, function(response) {
                debug(FUNCTIONALITY.meetup_api_Event_post, '_promoteUserToEventOrganizer response return', response);
                //todo: handle response.problem
                resolve(response);
            }).on('error', function (error) {
                debug(FUNCTIONALITY.meetup_api_Event_post, '_promoteUserToEventOrganizer error return', error);
                reject(error);   
            });
        });
    });
}

function _postViaRestClient(req, res, event) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {

            var args = {
                data: {},
                parameters: {
                    group_id: _localLearnersGroupId,
                    group_urlname: _localLearnersGroupUrlName,
                    name: event.name,
                    time: event.time
                },
                headers: {
                    Authorization: 'Bearer ' + req.user.accessToken,
                    'Content-Type': 'application/json'
                }
            }
            
            if (LL_ENVIRONMENT === 'development') {
                args.data.user = req.user;
            }

            var url = MEETUP_API_ENDPOINT + '/event';
            restClient.post(url, args, function(createdEvent) {
                debug(FUNCTIONALITY.meetup_api_Event_post, '_postViaRestClient', { createdEvent: createdEvent });
                if (createdEvent.problem) {
                    reject(createdEvent);
                } else {
                    resolve(createdEvent);
                }
            }).on('error', function(error) {
                debug(FUNCTIONALITY.meetup_api_Event_post, '_postViaRestClient error', error);
                reject('Error posting event: ', error);
            });
            
        });
    }
}

///////////////////////////////////////////////////////////////////////////////////////


function Event_get(id) {
    
    return Q.Promise(function (resolve, reject, notify) {
        restClient.get(MEETUP_API_ENDPOINT + '/event/' + id + '?&sign=true&photo-host=public&page=20&key=' + LL_ADMINISTRATOR_API_KEY, function(event) {
            debug(FUNCTIONALITY.meetup_api_Event_get, 'Event_get', { id: id, event: event });
            resolve(event);
        }).on('error', function (error) {
            debug(FUNCTIONALITY.meetup_api_Event_get, 'Event_get error', { id: id, error: error });
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



