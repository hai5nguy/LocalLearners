
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
            res.json(context.RequestedClass.requestList);
        }, function () {
            res.status(500).send(context.Error);
        });
    });
    
    app.get('/api/requested/:id', function (req, res) {
        
        var context = new CONTEXT();
        context.RequestedClass.getId = req.params.id;
        
        RequestedClass.get(context)().then(function(requestedClass) {
            res.json(context.RequestedClass.record);
        }, function (err) {
            res.status(500).send(context.Error);
        });       

    });

    app.post('/api/requested', Authentication.ensureAuthenticated, function (req, res, next) {
        
        var context = new CONTEXT();
        context.Authentication.user = req.user;
        context.RequestedClass.newRequest = {
            name: req.body.name,
            category: req.body.category,
            requester: req.user._id,
            interestedUsers: [ req.user._id ]
        };
        
    	Q.fcall(RequestedClass.allocateNew(context))
            .then(function () {
                res.json(context.RequestedClass.record);
            })
            .catch(function () {
                res.status(500).send(context.Error);
            })
            .done();
        
    }); //api/requested

    app.post('/api/requested/:id/setuserinterested', Authentication.ensureAuthenticated, function (req, res) {
        
        var context = new CONTEXT();
        context.Authentication.user = req.user;
        context.RequestedClass = {
            Interested: {
                requestId: req.params.id,
                userId: req.user._id,
                userIsInterested: req.body.interested
            }
        };
        
//        d(context.RequestedClass);
        
        RequestedClass.setUserInterested(context)().then(function () {
            t();
            res.json(context.RequestedClass.record);
        }, function () {
            res.status(500).send(context.Error);
        });
        
    });  //api/requested/:id/setuserinterested
    
})();
//
//function validateRequestedClass(requestedClass) {
//    return function() {
//        return Q.Promise(function(resolve, reject, notify) {
//            if (IsPopulatedString(requestedClass.name) &&
//                IsPopulatedString(requestedClass.category)) {
//                
//                resolve(true);
//            } else {
//                reject('Invalid requested class');
//            }
//        });
//    }
//}

//function saveRequestedClass(requestedClass) {
//    return function() {
//        return Q.Promise(function(resolve, reject, notify) {
//            
//            db.Requested.add(requestedClass).then(function (savedRequested) {
//                resolve(savedRequested);
//            }, function (error) {
//                reject(error);
//            });
//
//        });
//    }
//}

function serverError(res, err) {
    res.status(500).send({ error: err });
}
