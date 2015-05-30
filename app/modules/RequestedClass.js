var Q               = require(LL_NODE_MODULES_DIR + 'q');

//var meetupApi = require('../meetup-api.js')(THE_APP);
var Database        = require(LL_MODULES_DIR + 'Database.js');
var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');


var RequestedClass = (function () {
	return {
		allocateNew: CONTEXTPROMISE(allocateNew),
		get: CONTEXTPROMISE(get),
		getAll: CONTEXTPROMISE(getAll),
		setUserInterested: CONTEXTPROMISE(setUserInterested),
		validate: CONTEXTPROMISE(validate)
	};
	
	function allocateNew(context, resolve, reject, notify) {
        Q.fcall(RequestedClass.validate(context))
            .then(Database.Requested.allocateNew(context))
            .then(resolve)
            .catch(reject)
            .done();
	}
	
	function get(context, resolve, reject, notify) {
		context.Database.query = { _id : context.RequestedClass.getId };
		Database.Requested.get(context)().then(resolve, reject);
	}
	
	function getAll(context, resolve, reject, notify) {
		context.Database.query = {};
		Database.Requested.getAll(context)().then(resolve, reject);
	}
	
	function setUserInterested(context, resolve, reject, notify) {
		context.Database.query = { _id: context.RequestedClass.Interested.requestId };
        
        Q.fcall(Database.Requested.get(context))
            .then(function () {
                if (context.RequestedClass.Interested.setInterested) {
                    addUserToInterested();
                } else {
                    removeUserFromInterested();
                }
            })
            .then(Database.Requested.sync(context))
            .then(resolve)
            .catch(reject)
            .done();
            
        function addUserToInterested() {
            var interestedUsers = context.RequestedClass.record.interestedUsers;
            var interestedUserId = context.RequestedClass.Interested.userId;
            
            if (interestedUsers.indexOf(interestedUserId) === -1) {
                context.RequestedClass.record.interestedUsers.push(interestedUserId);
            }
        }

        function removeUserFromInterested() {
            var interestedUsers = context.RequestedClass.record.interestedUsers;
            var interestedUserId = context.RequestedClass.Interested.userId;
            
            d(interestedUsers.indexOf(interestedUserId), interestedUsers.toObject(), interestedUserId);
            if (interestedUsers.indexOf(interestedUserId) !== -1) {
                d(context.RequestedClass.record.interestedUser.toObject());
                context.RequestedClass.record.interestedUsers.splice(interestedUserId, 1);
                d(context.RequestedClass.record.interestedUser.toObject());
            }
        }
        
    } //setUserInterested
	
	function validate(context, resolve, reject, notify) {
        ASSERT.exists(context.RequestedClass.newRequest, 'context.RequestedClass.newRequest must exist');
        var newRequest = context.RequestedClass.newRequest;
        if (!IsPopulatedString(newRequest.name)) {
            context.Error = {
                message: 'Invalid request name'
            };
            reject();
        } else if (!IsPopulatedString(newRequest.category)) {
            context.Error = {
                message: 'Invalid request category'
            };
            reject();
        } else {
        	resolve();
		}
	}
	
})();

module.exports = RequestedClass;