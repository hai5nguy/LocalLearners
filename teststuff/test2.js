require('./environmentals.js');
require('./core.js');

var Q = require('../node_modules/q');
var UpcomingClass = require(LL_MODULES_DIR + 'UpcomingClass.js')();
var a = require(LL_MODULES_DIR + 'UpcomingClass.js')();

var context = {
    upcomingClass: {
        name: 'adsfasdf',
        category: 'asdfsdf',
        time: 1234234234
    }
};



console.log('ab ', a == UpcomingClass);


//
//UpcomingClass('createNew', context)().then(function (c) {
//    console.log('1111 ', c );
//}, function (c) {
//    console.log('error ', c);
//});

//
//var context = {
//    resolve: true,
//    test: 'test 1'
//};
//
//var a, b;
//
//setTimeout(function() {
//    a = UpcomingClass('test', context);
//    a();
//    
//    console.log('done ', a == b);
//}, 3000);
//
//context.test = 'test 2';
//
//b = UpcomingClass('test', context);
//b();
//
//
//var anotherContext = {
//    resolve: true,
//    test: 'another context'
//}
//
//UpcomingClass('test', anotherContext)();
//
////Q.fcall(UpcomingClass(context, 'test'))
////    .then(changeContext)
////    .then(UpcomingClass(context, 'test'))
////    .catch(function (context) {
////        console.log('error ', context);
////    })
////    .done()
////
////console.log('done ', context.test);
////
////
////function changeContext(context) {
////    context.test = 'context changed rejected';
////    return Q.Promise(function (resolve, reject, noitfy) {
////        console.log('inside changeContext');
////        reject(context);
////    });
////}
