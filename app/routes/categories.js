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
})();
