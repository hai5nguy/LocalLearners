var Q               = require(LL_NODE_MODULES_DIR + 'q');

var Database        = require(LL_MODULES_DIR + 'Database.js');

module.exports = function (options) {

        var self = {
                error: null,
                req: options.req
        };
        
        self.Record = new RECORD();
        
        
	// var self = new DEITYOBJECT({
	// 	error: null,
	// 	req: options.req
	// });
        
        self.Record = {};
        
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
        
        self.RecordSet = new RECORDSET();
        
        
        self.RecordSet.load = PROMISIFY(function (params, resolve, reject) {
                
                Database.read({ collectionName: 'Categories' }).then(function (categories) {
                        self.RecordSet.set(categories);
                }, function (error) {
                        self.error = error;
                        reject();
                });
        });
        
	return self;
	
};


