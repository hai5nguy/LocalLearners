var Q = require('../node_modules/q');
var module2 = require('./testModule2.js')();

var testModule = (function() {
	
	var promiseFunctions = {
		'promise1': promise1,
		'promise2': promise2
	};
	
	
	return {
		invoke: function(name, context) {
			return function() {
				return Q.Promise(function (resolve, reject, notify) {
					promiseFunctions[name](context, resolve, reject, notify);
				});
			};
		},
		blah: 'blah',
		foo: function () { console.log ('in foo'); },
		module2: module2
	};
})();

function promise1(context, resolve, reject, notify) {
	console.log('inside promise1');
	setTimeout(function () {
		console.log('resolving promise1');
//		var weird = require('./testModule');
//		console.log('weird ', testModule == weird);
		resolve(context);
	}, 3000);
}
function promise2(context, resolve, reject, notify) {
	console.log('inside promise2');
	setTimeout(function () {
		console.log('resolving promise2');
		resolve(context);
	}, 3000);
}


module.exports = testModule;


