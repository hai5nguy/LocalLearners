var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js')(THE_APP);
var db = require('../db.js')(THE_APP);
var authentication = require('../authentication.js')(THE_APP);

module.exports = function (app) {

    app.get('/requestedclasses', function (req, res) {

        db.getRequestedClasses().then(function (requestedClasses) {
            //console.log('/requestedclasses requestedClasses ', JSON.stringify(requestedClasses));
            res.json(requestedClasses);
        }, function (err) {
            serverError(res, err);
        });

    });

//    app.get('/requestedclasses/:id', function (req, res) {
//        //TODO: implement this
//        res.json({ upcomingclass: 'upcoming class with id ' + req.params.id });
//
//    });

    app.post('/requestedclasses', function(req, res, next) {
        
        if (!req.isAuthenticated()) {
            authentication.logUserIn(req, res);
        }
        
        var requestedClass = {
            name: req.body.name,
            categoryName: req.body.categoryName,
            category: {},
            interestedMembers: []
        };

        if (isRequestedClassValid(requestedClass)) {

            db.getCategory({ name: requestedClass.categoryName }).then(function (category) {

                delete requestedClass.categoryName;
                requestedClass.category = category;
                requestedClass.interestedMembers.push(req.session.profile);

                db.addRequestedClass(requestedClass).then(function (savedRequested) {
//                    console.log('/requestedclasses savedrequested ', JSON.stringify(savedRequested));
                    res.json({ status: 'success', savedRequested: savedRequested });
                }, function (err) {
                    serverError(res, err);
                });

            }, function (err) {
                serverError(res, err);
            });

        } else {
            serverError(res, { error: 'Upcoming Class invalid' });
        }
    });
}

function isRequestedClassValid(requestedClass) {
    return (
        IsPopulatedString(requestedClass.name) &&
        IsPopulatedString(requestedClass.categoryName)
    )
}

function serverError(res, err) {
    res.status(500).send({ error: err });
}
