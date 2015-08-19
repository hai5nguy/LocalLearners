require('./environmentals.js');

var Q       = require(LL_NODE_MODULES_DIR + 'q');
var _       = require(LL_NODE_MODULES_DIR + 'underscore');
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

global.PROMISIFY = function(workFunction) {
    return function (params) {
        return Q.Promise(function (resolve, reject) {
            workFunction(params, resolve, reject);
        });
    }
};

global.DEITYOBJECT = function(initialData) {
    return {
        _data: initialData || {},
        get: function (name) {
            if (!name) {
                return this._data;
            } else {
                return this._data[name];
            }
        },
        set: function (nameOrObject, value) {
            if (typeof nameOrObject === 'object') {
                this._data = nameOrObject;
            } else {
                this._data[nameOrObject] = value;
            }
        }
    }
};

global.BASEDATA = function (initialData) {
    var self = this;
    self._data = initialData || {};
    self.get = function (name) {
        return (name ? self._data[name] | self._data )
    };
    self.add = function (newData) {
        _.extend(self._data, newData);
    };
    self.set = function (nameOrObject, value) {
        (arguments.length === 1) ? self._data = nameOrObject : self._data[nameOrObject] = value;
    };
}

global.BASECOLLECTION = function (initialItems) {
    return {
        _items: initialItems || [],
        get: function (id) {
            return (id === undefined) ? this._items : _.findWhere(this._items, { _id: id });
        },
        add: function (items) {
            this._items = this._items.concat(items);
        },
        remove: function (id) {
            this._items = _.without(this._items, _.findWhere(this._items, { _id: id }));
        }
    }
};

global.BASEMODULE = function (initialData, initialItems) {

    var self = this;
    self.error = null;
    self.Data = new BASEDATA(initialData);
    self.Collection = new BASECOLLECTION(initialItems)

    return self;
}