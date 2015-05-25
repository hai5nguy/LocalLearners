var Q           = require(LL_NODE_MODULES_DIR + 'q');

//var Database    = require(LL_MODULES_DIR + 'Database.js');
var Category    = require(LL_MODULES_DIR + 'Category.js');

module.exports = (function () {
    THE_APP.get('/api/category/all', function (req, res) {
        var context = new CONTEXT();
        Category.getAll(context)().then(function() {
            res.json(context.Category.all);
        }, function () {
            res.status(500).send(context.Error);
        });
    });
})();
