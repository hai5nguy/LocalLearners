var Q               = require(LL_NODE_MODULES_DIR + 'q');
var restClient  	= new (require(LL_NODE_MODULES_DIR + 'node-rest-client').Client)();

var RestService             = require(LL_MODULES_DIR + 'RestService.js');
var MeetupAdministrator     = require(LL_MODULES_DIR + 'MeetupAdministrator.js');

var _localLearnersGroupId = 18049722;  //todo: move to environmentals, maybe not??
var _localLearnersGroupUrlName = 'locallearners';

var Meetup = {
    Event: Event()
}

module.exports = Meetup;

function Event() {

    
    return {
        Item: Item,
        Collection: Collection
    }

    function Item(params) {
        var eventSelf = BASEITEM();

        eventSelf.error = null;
        eventSelf.req = params.req;

        eventSelf.post = PROMISIFY(post);

        return eventSelf;

        /**
         * params {
         *      newEventInfo: {},
         * }
         */
        function post(params, resolve, reject) {

            var userProfile = new Meetup.Profile.Item({ req: params.req });

            userProfile.ensureOrganizerStatus().then(function () {

                var restParams = {
                    url: MEETUP_API_ENDPOINT + '/event',
                    args: {
                        data: (LL_ENVIRONMENT === 'development') ? { user: eventSelf.req.user } : {},
                        parameters: {
                            group_id: _localLearnersGroupId,
                            group_urlname: _localLearnersGroupUrlName,
                            name: event.name,
                            time: new Date(event.time).getTime()
                        },
                        headers: {
                            Authorization: 'Bearer ' + context.Authentication.user.accessToken,
                            'Content-Type': 'application/json'
                        }
                    }
                };

                RestClient.post({

                })

            }, function () {
                
            });

            
            MeetupApi.Profile.ensureOrganizer(context)().then(function() {
                
                var event = context.UpcomingClass.record.meetup.event;
                
                context.RestService = 
                
                RestService.post(context)().then(function () {
                    var createdEvent = context.RestService.result;
                    if (createdEvent.problem) {
                        context.Error = {
                            message: 'Error creating event on meetup',
                            createdEvent: createdEvent
                        };
                        reject();
                    } else {
                        context.UpcomingClass.record.meetup.event = event;
                        resolve();
                    }
                    
                }, reject);
                
            }, reject);
                
                    
        } //post



    }

    function Collection() {

    }
}


function Profile() {
    return {
        Item: Item,
        Collection: Collection

        // ensureOrganizer: CONTEXTPROMISE(ensureOrganizer),
        // get: CONTEXTPROMISE(get),
        // getRole: CONTEXTPROMISE(getRole),
        // promoteUser: CONTEXTPROMISE(promoteUser)
    }

    function Item(params) {

    }

    function Collection(params) {

    }
    
    function ensureOrganizer(context, resolve, reject, notify) {
        
        MeetupApi.Profile.getRole(context)().then(function () {
            var currentRole = context.Authentication.user.meetupProfile.role;
            if (currentRole === 'Event Organizer' || currentRole === 'Organizer') {
                resolve();
            } else {
                MeetupApi.Profile.promoteUser(context)().then(resolve, reject);
            }
        }, reject);
        
    }
    
    function get(context, resolve, reject, notify) {
        context.RestService = {
            url:  MEETUP_API_URL.MEMBER + MEETUP_API_URL.MEMBER_QUERYSTRING,
            args: {
                headers: { Authorization: 'Bearer ' + context.Authentication.user.accessToken }
            }
        };
        
        RestService.get(context)().then(function () {
//            debug(FUNCTIONALITY.MeetupApi_Profile_get, 'Profile.get', { context: context });
            var meetupProfile = context.RestService.result;
            if (!meetupProfile.photo) { 
                meetupProfile.photo = {};
                meetupProfile.photo.thumb_link = MEETUP_API_URL.DEFAULT_PHOTO_THUMB_LINK;
            }
            context.Authentication.user.meetupProfile = meetupProfile;
            resolve();
        }, reject);

    }
    
    function getRole(context, resolve, reject, notify) {
        ASSERT.exists(context.Authentication.user);
        var user = context.Authentication.user;
        MeetupAdministrator.getAccessToken(context)().then(function () {
            context.RestService = {
                url: MEETUP_API_URL.PROFILE + '/' + _localLearnersGroupId + '/' + user.meetupProfile.id,
                args: {
                    headers: {
                        Authorization: 'Bearer ' + context.MeetupAdministrator.accessToken 
                    }
                }
            };
        
            RestService.get(context)().then(function () {
                var meetupProfile = context.RestService.result;
                context.Authentication.user.meetupProfile.role = meetupProfile.role;
                resolve();
            }, reject);
            
        }, reject);
        
        
    } //getRole
    
    function promoteUser(context, resolve, reject, notify) {
        ASSERT.exists(context.Authentication.user, 'context.Authentication.user must exists');
        MeetupAdministrator.getAccessToken(context)().then(function () {
            var user = context.Authentication.user;
            
            context.RestService = {
                args: {
                    parameters: {
                        add_role: 'event_organizer'
                    },
                    headers: {
                        Authorization: 'Bearer ' + context.MeetupAdministrator.accessToken
                    }
                },
                url: MEETUP_API_URL.PROFILE + '/' + _localLearnersGroupId + '/' + user.meetupProfile.id
            };
    
            RestService.post(context)().then(function() {
                var result = context.RestService.result;
                if (result.code && result.code === 'not_authorized') {
                    context.Error = {
                        message: 'Problem encountered with promoting user',
                        restService_result: result
                    };
                    reject();
                } else {
                    resolve();
                }
            }, reject);
            
        }, reject);
        
	} //promoteUser

} //Profile

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function ensureUserIsEventOrganizer(context) {
//    return FCALLWRAPPER(function (resolve, reject, notify) {
//        getUserMeetupRole(context).then(function (context) {
////            debug(FUNCTIONALITY.MeetupApi_Event_post, 'ensureUserIsEventOrganizer', { context: context });
//            var currentRole = context.user.meetupProfile.role;
//            if (currentRole === 'Event Organizer' || currentRole === 'Organizer') {
//                resolve();
//            } else {
//                promoteUserToEventOrganizer(context).then(resolve, reject);
//            }
//        }, reject);
//    })();
//}

//function getUserMeetupRole(context) {
//    return Q.Promise(function (resolve, reject, notify) {
//        var getArgs = {
//            headers: {
//                Authorization: 'Bearer ' + context.user.accessToken
//            }
//        };
//        
//        var url = MEETUP_API_URL.PROFILE + '/' + _localLearnersGroupId + '/' + context.user.meetupProfile.id;
//
//        restClient.get(url, getArgs, function(meetupProfile) {
//            debug(FUNCTIONALITY.MeetupApi_Event_post, 'getUserMeetupRole', { meetupProfile: meetupProfile });
//            context.user.meetupProfile.role = meetupProfile.role;
//            resolve(context);
//        }).on('error', function (error) {
//            context.Error = {
//                message: 'Failed to get user role on meetup.',
//                innerError: error
//            }
//            reject(context);
//        });
//    });
//}

//function promoteUserToEventOrganizer(context) {
//    return Q.Promise(function (resolve, reject, notify) {
//        
//    });
//}

//
//function postViaRestClient(context) {
//    return Q.Promise(function (resolve, reject, notify) {
//        context.RestService = {
//            url: MEETUP_API_ENDPOINT + '/event',
//            args: {
//                data: (LL_ENVIRONMENT === 'development') ? context.user : {},
//                parameters: {
//                    group_id: _localLearnersGroupId,
//                    group_urlname: _localLearnersGroupUrlName,
//                    name: context.upcomingClass.name,
//                    time: context.upcomingClass.time
//                },
//                headers: {
//                    Authorization: 'Bearer ' + context.user.accessToken,
//                    'Content-Type': 'application/json'
//                }
//            }
//        }
//
//        //context.RestService.args
//        //context.RestService.result || context.Error
//        RestService.post(context)().then(function () {
//            
//            var createdEvent = context.result;
//            if (createdEvent.problem) {
//                context.Error = {
//                    message: 'Error create event on meetup',
//                    createdEvent: createdEvent
//                };
//                reject();
//            } else {
//                context.MeetupApi.Event.posted = createdEvent;
//                resolve();
//            }
//            debug(FUNCTIONALITY.MeetupApi_Event_post, 'postViaRestClient', { context: context, createdEvent: createdEvent });
//            
//        }, reject);
//        
//    });
//}










//module.exports = function(args) {
//    
//    return {
//        session: args.session,
//        Event: {
//            get: Event_get,
//            getAll: Event_getAll,
//            post: Event_post
//        }
//    };
//
//    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    // Public Functions
//    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    function Event_get(args) {
//
//        return Q.Promise(function (resolve, reject, notify) {
//            restClient.get(MEETUP_API_ENDPOINT + '/event/' + args.id + '?&sign=true&photo-host=public&page=20&key=' + LL_ADMINISTRATOR_API_KEY, function(event) {
//                debug(FUNCTIONALITY.meetup_api_Event_get, 'Event_get', { args: args, event: event });
//                resolve(event);
//            }).on('error', function (error) {
//                debug(FUNCTIONALITY.meetup_api_Event_get, 'Event_get error', { args: args, error: error });
//                reject(error);
//            });
//        });
//
//        /*
//         {
//         "utc_offset": -14400000,
//         "headcount": 0,
//         "visibility": "public",
//         "waitlist_count": 0,
//         "created": 1427846828000,
//         "maybe_rsvp_count": 0,
//         "event_url": "http://www.meetup.com/LocalLearners/events/221536470/",
//         "yes_rsvp_count": 1,
//         "announced": false,
//         "name": "test class DO NOT RSVP",
//         "id": "221536470",
//         "time": 1430521200000,
//         "updated": 1427846828000,
//         "group": {
//         "join_mode": "open",
//         "created": 1415053890000,
//         "name": "Local Learners",
//         "group_lon": -86.16000366210938,
//         "id": 18049722,
//         "urlname": "LocalLearners",
//         "group_lat": 39.77000045776367,
//         "who": "Learners"
//         },
//         "status": "upcoming"
//         }
//         */
//    }
//
//    function Event_getAll() {
//        return Q.Promise(function (resolve, reject, notify) {
//            restClient.get(MEETUP_API_ENDPOINT + '/events?&sign=true&photo-host=public&fields=event_hosts&group_id=' + _localLearnersGroupId + '&page=20&key=' + LL_ADMINISTRATOR_API_KEY,
//                function(data) {
//                    if (data && data.results) {
//                        resolve(data.results);
//                    } else {
//                        reject('Event_getAll - error gettting events');
//                    }
//                }).on('error', function (error) {
//                    console.log('meetup-api.js Event_getAll error ', error);
//                    reject(error);
//                });
//        });
//    }
//
//    ///////////////////////////////////////////////////////////////////////////////////////
//
//    function Event_post(args) {
//        debug(FUNCTIONALITY.MeetupApi_Event_post, 'args', args);
//        return Q.Promise(function (resolve, reject, notify) {
//
//            Q.fcall(_checkEventValid(args.event))
//                .then(_ensureUserIsEventOrganizer(args))
//                .then(_postViaRestClient(args.event))
//                .then(function (postedEvent) {
//                    resolve(postedEvent);
//                })
//                .catch(reject)
//                .done();
//        });
//
//    }
//
//    function _checkEventValid(event) {
//        return function() {
//            return Q.Promise(function (resolve, reject, notify) {
//                if ( event &&
//                    IsPopulatedString(event.name) &&
//                    IsPopulatedNumber(event.time) ) {
//
//                    resolve();
//                } else {
//                    reject('Invalid event ' + JSON.stringify(event));
//                }
//            });
//        }
//    }
//
//    function _ensureUserIsEventOrganizer() {
//        return function() {
//            return Q.Promise(function (resolve, reject, notify) {
//
//                _getUserMeetupRole(args).then(function (role) {
//                    debug(FUNCTIONALITY.MeetupApi_Event_post, '_ensureUserIsEventOrganizer role return', role)
//                    if (role === 'Event Organizer' || role === 'Organizer') {
//                        resolve();
//                    } else {
//                        _promoteUserToEventOrganizer().then(resolve, reject);
//                    }
//                });
//            });
//        }
//    }
//
//    function _getUserMeetupRole() {
//        return Q.Promise(function (resolve, reject, notify) {
//            var getArgs = {
//                headers: {
//                    Authorization: 'Bearer ' + this.user.accessToken
//                }
//            };
//            var url = 'https://api.meetup.com/2/profile/' + _localLearnersGroupId + '/' + args.user.id;
//
//            restClient.get(url, getArgs, function(meetupProfile) {
//                debug(FUNCTIONALITY.MeetupApi_Event_post, '_getUserMeetupRole meetupProfile return', meetupProfile);
//                resolve(meetupProfile.role);
//            }).on('error', function (error) {
//                reject(error);
//            });
//        });
//    }
//
//    function _promoteUserToEventOrganizer(req) {
//        return Q.Promise(function (resolve, reject, notify) {
//            meetupAdministrator.getAdministratorAccessToken().then(function (token) {
//                var args = {
//                    parameters: {
//                        add_role: 'event_organizer'
//                    },
//                    headers: {
//                        Authorization: 'Bearer ' + token
//                    }
//                };
//
//                console.log('11111 ', this);
//                
//                var url = 'https://api.meetup.com/2/profile/' + _localLearnersGroupId + '/' + this.session.user.meetupProfile.id;
//                restClient.post(url, args, function(response) {
//                    debug(FUNCTIONALITY.MeetupApi_Event_post, '_promoteUserToEventOrganizer response return', response);
//                    //todo: handle response.problem
//                    resolve(response);
//                }).on('error', function (error) {
//                    debug(FUNCTIONALITY.MeetupApi_Event_post, '_promoteUserToEventOrganizer error return', error);
//                    reject(error);
//                });
//            });
//        });
//    }
//
//    function _postViaRestClient(args) {
//        return function() {
//            return Q.Promise(function (resolve, reject, notify) {
//
//                var postArgs = {
//                    data: {},
//                    parameters: {
//                        group_id: _localLearnersGroupId,
//                        group_urlname: _localLearnersGroupUrlName,
//                        name: args.event.name,
//                        time: args.event.time
//                    },
//                    headers: {
//                        Authorization: 'Bearer ' + args.user.accessToken,
//                        'Content-Type': 'application/json'
//                    }
//                }
//
//                if (LL_ENVIRONMENT === 'development') {
//                    args.data.user = args.user;
//                }
//
//                var url = MEETUP_API_ENDPOINT + '/event';
//                restClient.post(url, postArgs, function(createdEvent) {
//                    debug(FUNCTIONALITY.MeetupApi_Event_post, '_postViaRestClient', { createdEvent: createdEvent });
//                    if (createdEvent.problem) {
//                        reject(createdEvent);
//                    } else {
//                        resolve(createdEvent);
//                    }
//                }).on('error', function(error) {
//                    debug(FUNCTIONALITY.MeetupApi_Event_post, '_postViaRestClient error', error);
//                    reject('Error posting event: ', error);
//                });
//
//            });
//        }
//    }
//
/////////////////////////////////////////////////////////////////////////////////////////
//}
//
//
//
////
////
////    
////    
////    _this.Profile = {
////        get: Profile_get
////    };
////    
////    _this.RSVP = {
////        get: RSVP_get,
////        update: RSVP_update
////    };
////    
////
////

//////https://api.meetup.com/2/rsvps?&sign=true&photo-host=public&event_id=222028697&page=20
////function RSVP_get(eventId) {
////    return Q.Promise(function (resolve, reject, notify) {
////        
////        var url = MEETUP_API_ENDPOINT + '/rsvps?&sign=true&photo-host=public&event_id=' + eventId + '&page=20&key=' + LL_ADMINISTRATOR_API_KEY;
////        restClient.get(url, function (response) {
////            debug(FUNCTIONALITY.meetup_api_RSVP_get, 'RSVP_get', { eventId: eventId, response: response });
////            resolve({});
////        }).on('error', function (error) {
////            debug(FUNCTIONALITY.meetup_api_RSVP_get, 'RSVP_get error', { eventId: eventId, error: error });
////            reject(error);
////        });
////        
////    });  
////}
////
////function RSVP_update(req, args) {
////    return Q.Promise(function (resolve, reject, notify) {
////        
////        var url = MEETUP_API_ENDPOINT + '/rsvp';
////        var postData = {
////            parameters: {
////                event_id: args.eventId ,
////                rsvp: args.isAttending ? 'yes' : 'no'
////            },
////            headers: {
////                Authorization: 'Bearer ' + req.user.accessToken
////            }
////        };
////
////        restClient.post(url, postData, function (rsvpResult) {
////            console.log('11111111 rsvp result =============================');
////            console.log(rsvpResult);
////            
////            resolve();
////        });
////    });
////}
////
////
////
//
//
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Private Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
