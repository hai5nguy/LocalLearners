var Q               = require(LL_NODE_MODULES_DIR + 'q');

var Database        = require(LL_MODULES_DIR + 'Database.js');

var Category = (function () {
	return {
		getAll: CONTEXTPROMISE(getAll)
	};
	
	function getAll(context, resolve, reject, notify) {
		context.Database.query = {};
		Database.Category.getAll(context)().then(resolve, reject);
	}
	
})();

module.exports = Category;