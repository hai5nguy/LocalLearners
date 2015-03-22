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
    
    app.get('/api/requested/:id', function (req, res) {
        
        db.getRequestedClass(req.params.id).then(function(requestedClass) {
            //console.log('api/requested/:id requestedClass', JSON.stringify(requestedClass));
            res.json(requestedClass);
        }, function (err) {
            serverError(res, err);
        });
        
    });

    app.post('/requestedclasses', function (req, res, next) {
        
        //todo: authentication
        //if (!req.isAuthenticated()) {
        //    authentication.logUserIn(req, res);
        //}
        
        var requestedClass = {
            name: req.body.name,
            categoryName: req.body.categoryName,
            category: {},
            requester: req.user._id,
            interestedUsers: [ req.user._id ]
        };

        if (isRequestedClassValid(requestedClass)) {

            db.getCategory({ name: requestedClass.categoryName }).then(function (category) {

                delete requestedClass.categoryName;
                requestedClass.category = category;

                db.addRequestedClass(requestedClass).then(function (savedRequested) {
                    //console.log('/requestedclasses savedrequested ', JSON.stringify(savedRequested));
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
    
    app.post('/api/requested/:id/addinteresteduser', function (req, res) {
        var addUser = db.Requested.addInterestedUser(req.params.id, req.user._id);
        addUser.then(function(requestedClass) {
            res.json({ status: 'success', requestedClass: requestedClass })
        }, function (err) {
            serverError(res, err);
        });
    });

    app.post('/api/requested/:id/setuserinterested', function (req, res) {
        var setInterested = db.Requested.setUserInterested(req.params.id, req.user._id, req.body.interested);
        setInterested.then(function(requestedClass) {
            res.json({ status: 'success', requestedClass: requestedClass })
        }, function (err) {
            serverError(res, err);
        });
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
