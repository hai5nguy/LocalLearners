var Q               = require(LL_NODE_MODULES_DIR + 'q');

//var meetupApi = require('../meetup-api.js')(THE_APP);
var Database        = require(LL_MODULES_DIR + 'Database.js');
var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');


var RequestedClass = (function () {
	return {
		getAll: CONTEXTPROMISE(getAll)
	}
	
	function getAll(context, resolve, reject, notify) {
		context.Database.query = {};
		Database.Requested.getAll(context)().then(resolve, reject);
	}
	
})();

module.exports = RequestedClass;