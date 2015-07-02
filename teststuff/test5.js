require('../app/core.js');
var UpcomingClass = require('../app/Modules/UpcomingClass.js');

var u1 = new UpcomingClass('u1');
var u2 = new UpcomingClass('u2');

u1.allocate().then(function (a) {
	console.log('a: ', a);
}, function (error) {
	console.log('error: ', error);
});

u2.allocate().then(function (a) {
	console.log('a: ', a);
}, function (error) {
	console.log('error: ', error);
});

console.log('u1 ', u1);
console.log('u2 ', u2);
console.log(u1.allocate === u2.allocate);