var Q               = require(LL_NODE_MODULES_DIR + 'q');

var Database        = require(LL_MODULES_DIR + 'Database.js');

module.exports = function (options) {

	var self = new DEITYOBJECT({
		error: null,
		req: options.req
	});
	
	self.retrieveAll = PROMISIFY(function (params, resolve, reject) {
		
		var record = new Database.CategoryRecord();
        
        record.retrieveAll(params).then(function () {
            self.set(record.get());
            resolve();
        }, function () {
            self.error = {
                message: 'Unable to retrieve all categories',
                databaseError: record.error
            };
            reject();
        });
        
	});
	
	return self;
	
};


