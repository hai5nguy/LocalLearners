var Q           = require(LL_NODE_MODULES_DIR + 'q');

var Database    = require(LL_MODULES_DIR + 'Database.js');

module.exports = function () {
    var app = THE_APP;
    app.get('/api/category/all', function (req, res) {
        var context = {};
        Database.Category.getAll(context)().then(function() {
            res.json(context.categories);
        }, function () {
            res.status(500).send(context);
        });
    });
};
