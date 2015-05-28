var Q               = require(LL_NODE_MODULES_DIR + 'q');

//var meetupApi = require('../meetup-api.js')(THE_APP);
var Database        = require(LL_MODULES_DIR + 'Database.js');
var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');


var RequestedClass = (function () {
	return {
		allocateNew: CONTEXTPROMISE(allocateNew),
		getAll: CONTEXTPROMISE(getAll),
		validate: CONTEXTPROMISE(validate)
	};
	
	function allocateNew(context, resolve, reject, notify) {
		context.RequestedClass.savedRequest = { test: 'teset' };
		context.Error = { error: 'error' };

		
//		reject();

        Q.fcall(RequestedClass.validate(context))
//            .then(Database.Upcoming.allocateNew(context))
            .then(resolve)
            .catch(reject)
            .done();
	}
	
	function getAll(context, resolve, reject, notify) {
		context.Database.query = {};
		Database.Requested.getAll(context)().then(resolve, reject);
	}
	
	function validate(context, resolve, reject, notify) {
        ASSERT.exists(context.RequestedClass.newRequest, 'context.RequestedClass.newRequest must exist');
        var newRequest = context.RequestedClass.newRequest;
        if (!IsPopulatedString(newRequest.name)) {
            context.Error = {
                message: 'Invalid request name'
            };
            reject(); return;
        }
        if (!IsPopulatedString(newRequest.category)) {
            context.Error = {
                message: 'Invalid request category'
            };
            reject(); return;
        }
        resolve();
	}
	
})();

module.exports = RequestedClass;