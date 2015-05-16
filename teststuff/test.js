//var a = require('./testModule.js');
//var b = require('./testModule.js');
//
//
//var am = a.module2;
//var bm = b.module2;
//
//console.log('zzz ', am == bm, a == b);
//

var testModule = require('./testModule.js');
testModule.invoke('promise1', {blah: 'blah'})().then(function (c) {
	console.log('c ', c);
}, function (e) {
	console.log('e ', e)
});
