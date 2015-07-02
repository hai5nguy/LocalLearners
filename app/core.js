require('./environmentals.js');

var Q       = require(LL_NODE_MODULES_DIR + 'q');
var Assert  = require(LL_MODULES_DIR + 'Assert.js');
var Context = require(LL_MODULES_DIR + 'Context.js');


global.ASSERT = Assert;
global.CONTEXT = Context;

var EventEmitter = require('events').EventEmitter;
global.globalEventEmitter = new EventEmitter();
global.EMITTEREVENTS = {
    AdministratorAccessTokenAcquired: 'AdministratorAccessTokenAcquired',
    AdministratorAccessTokenFailed: 'AdministratorAccessTokenFailed'
}

global.UPCOMING_CLASS_STATUS = {
    NEW: 'new',             
    NOT_POSTED: 'upcoming_class_status_not_posted'
}


global.IsEmptyNullUndefined = function(obj) {
    if (obj == undefined || obj == null) return true;
    if (obj.length == 0) return true;
    return false;
}
global.IsPopulatedString = function (str) {
    return (str && typeof str === 'string' && str !== '');
}
global.IsPopulatedNumber = function (num) {
    return (num != null && num != undefined && typeof num === 'number');
}
global.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

global.CONTEXTPROMISE = function (contextCapablePromiseFunction) {
    return function(context) {
        return function() {
            return Q.Promise(function (resolve, reject, notify) {
                contextCapablePromiseFunction(context, resolve, reject, notify);
            });
        };
    };
};

global.FCALLWRAPPER = function (promiseFunction) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            promiseFunction(resolve, reject, notify);
        });
    };
};

global.PROMISIFY = function (workFunction) {
    return function () {
        return Q.Promise(workFunction);
    };
};