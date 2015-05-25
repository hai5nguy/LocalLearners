//var Q   	            = require(LL_NODE_MODULES_DIR + 'q');

var Assert = (function () {
    return {
        exists: exists
    };
})();
module.exports = Assert;

function exists(valueToCheck, message) {
	if (!valueToCheck || typeof valueToCheck === 'undefined') {
		throw "AssertionError: " + message;
	}
}

