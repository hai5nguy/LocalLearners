//var Q   	            = require(LL_NODE_MODULES_DIR + 'q');

var Assert = (function () {
    return {
        exists: exists
    }
	
	function exists(valueToCheck, message) {
		if (typeof valueToCheck === 'undefined' || valueToCheck === null) {
			throw "AssertionError: " + message;
		}
	}
})();

module.exports = Assert;

