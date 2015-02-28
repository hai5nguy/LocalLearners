var EventEmitter = require('events').EventEmitter;
global.globalEventEmitter = new EventEmitter();
global.EMITTEREVENTS = {
    AdministratorAccessTokenAcquired: 'AdministratorAccessTokenAcquired',
    AdministratorAccessTokenFailed: 'AdministratorAccessTokenFailed'
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

