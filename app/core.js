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


global.RECORD = function(initialData) {
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

global.RECORDSET = function (initialData) {
    return {
        _records: initialData || [],
        get: function (id) {
            if (id === undefined) {
                return this._records;
            } else {
                return _.findWhere(this._records, { _id: id });
            }
        },
        set: function (idOrRecords, record) {
            if (arguments.length === 1) {
                this._records = idOrRecords;
            } else {
                var match = _.findWhere(this._records, { _id: idOrRecords });
                if (match) {
                    match = record;
                }
            }
        },
        add: function (record) {
            this._records.push(record);
        },
        remove: function (id) {
            this._records = _.without(this._records, _.findWhere(this._records, { _id: id }));
        }
    }
};

global.BASECOLLECTION = function (initialData) {
    return {
        _items: initialData || [],
        get: function (id) {
            if (id === undefined) {
                return this._items;
            } else {
                return _.findWhere(this._items, { _id: id });
            }
        },
        // set: function (idOrItems, item) {
        //     if (arguments.length === 1) {
        //         this._items = idOrItems;
        //     } else {
        //         var match = _.findWhere(this._items, { id: idOrItems });
        //         if (match) {
        //             match = item;
        //         }
        //     }
        // },
        add: function (items) {
            this._items.push(items);
        },
        remove: function (id) {
            this._items = _.without(this._items, _.findWhere(this._items, { _id: id }));
        }
    }
};