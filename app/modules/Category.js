var Q               = require(LL_NODE_MODULES_DIR + 'q');

var Database        = require(LL_MODULES_DIR + 'Database.js');

module.exports = {
    Collection: Collection
};

function Collection (options) {

    var collectionSelf = new BASECOLLECTION();

    collectionSelf.error = null;
    collectionSelf.req = options.req;

    // collectionSelf.retrieveAll = PROMISIFY(function (params, resolve, reject) {
        
    //         var record = new Database.CategoryRecord();
                
    //             record.retrieveAll(params).then(function () {
    //                 collectionSelf.set(record.get());
    //                 resolve();
    //             }, function () {
    //                 collectionSelf.error = {
    //                     message: 'Unable to retrieve all categories',
    //                     databaseError: record.error
    //                 };
    //                 reject();
    //             });
        
    // });
    
    
    collectionSelf.load = PROMISIFY(function (params, resolve, reject) {
            
            Database.read({ collectionName: 'Categories' }).then(function (categories) {
                collectionSelf.add(categories);
                resolve();
            }, function (error) {
                collectionSelf.error = error;
                reject();
            });
    });
        
    return collectionSelf;
}



