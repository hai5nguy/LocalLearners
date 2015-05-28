
//var meetupApi = require('../meetup-api.js')(THE_APP);
//var Database        = require(LL_MODULES_DIR + 'Database.js');
var Q               = require(LL_NODE_MODULES_DIR + 'q');

var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');
var RequestedClass  = require(LL_MODULES_DIR + 'RequestedClass.js');

module.exports = (function () {
    var app = THE_APP;
    
    app.get('/api/requested', function (req, res) {
        var context = new CONTEXT();
        RequestedClass.getAll(context)().then(function () {
            res.json(context.requested);
        }, function () {
            res.status(500).send(context);
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

    app.post('/api/requested', Authentication.ensureAuthenticated, function (req, res, next) {
        
        var context = new CONTEXT();
        context.Authentication.user = req.user;
        context.RequestedClass.newRequest = {
            name: req.body.name,
            category: null
//            category: req.body.category
//            requester: req.user._id,
//            interestedUsers: [ req.user._id ]
        };
        
        
//        var requestedClass = {

//        };

//        d(context);
        t();
//        res.json(context);
        
//        
    	Q.fcall(RequestedClass.allocateNew(context))
            .then(function () {
                t();
                res.json(context.RequestedClass.savedRequest);
//                RequestedClass.buildNew(context)();
            })
            .catch(function () {
                t();
                res.status(500).send(context.Error);
            })
            .done();
//        
////        
//
//        Q.fcall(validateRequestedClass(requestedClass))
//            .then(saveRequestedClass(requestedClass))
//            .then(function (savedRequested) {
//                res.json({ status: 'success', savedRequested: savedRequested });
//            })
//            .catch(function (error) {
//                res.status(500).send({ error: error });
//            })
//            .done();
        
    }); //api/requested

    app.post('/api/requested/:id/setuserinterested', function (req, res) {
        var setInterested = db.Requested.setUserInterested(req.params.id, req.user._id, req.body.interested);
        setInterested.then(function(requestedClass) {
            res.json({ status: 'success', requestedClass: requestedClass })
        }, function (err) {
            serverError(res, err);
        });
    });
    
})();

function validateRequestedClass(requestedClass) {
    return function() {
        return Q.Promise(function(resolve, reject, notify) {
            if (IsPopulatedString(requestedClass.name) &&
                IsPopulatedString(requestedClass.category)) {
                
                resolve(true);
            } else {
                reject('Invalid requested class');
            }
        });
    }
}

function saveRequestedClass(requestedClass) {
    return function() {
        return Q.Promise(function(resolve, reject, notify) {
            
            db.Requested.add(requestedClass).then(function (savedRequested) {
                resolve(savedRequested);
            }, function (error) {
                reject(error);
            });

        });
    }
}

function serverError(res, err) {
    res.status(500).send({ error: err });
}
