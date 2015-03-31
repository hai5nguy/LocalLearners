var Q = require('../../node_modules/q');
//var meetupApi = require('../meetup-api.js');
var db = require('../db.js')(THE_APP);

module.exports = function (app) {
    app.get('/api/category/all', function (req, res) {
        db.Category.getAll().then(function(categories) {
            res.json(categories);
        }, function (err) {
            serverError(res, err)
        });
    });
}

function serverError(res, err) {
    res.send(500, { error: err });
}