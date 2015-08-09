var Q           = require(LL_NODE_MODULES_DIR + 'q');

var Category            = require(LL_MODULES_DIR + 'Category.js');

module.exports = (function () {
    THE_APP.get('/api/category/all', function (req, res) {

        var category = Category({
            req: req
        });

        category.retrieveAll().then(function () {
            res.json(category.get());
        }, function () {
            res.status(500).send(category.error);
        });

    });
    
    THE_APP.get('/api/categories', function (req, res) {
        var categories = new Category.Collection({
            req: req
        });
        
        categories.load().then(function (categories) {
            res.json(categories.get());
        }, function () {
            res.status(500).send(categories.error);
        });
        
    });
    
})();
