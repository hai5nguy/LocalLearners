global.IsEmptyNullUndefined = function(obj) {
    if (obj == undefined || obj == null) return true;
    if (obj.length == 0) return true;
    return false;
}

global.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
