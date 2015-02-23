var EventEmitter = require('events').EventEmitter;
global.globalEventEmitter = new EventEmitter();

global.IsEmptyNullUndefined = function(obj) {
    if (obj == undefined || obj == null) return true;
    if (obj.length == 0) return true;
    return false;
}

global.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//
//var _app = {};
//global.APP = _app;
//
//global.setApp = function (a) {
//    _app = a;
//    console.log('thedamn APP', a);
//}
