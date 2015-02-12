var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js');
var db = require('../db.js');

module.exports = function (app) {
    app.get('/categories', function (req, res) {
        db.getCategories(function(categories) {
            res.json(categories);
        });
    });
}