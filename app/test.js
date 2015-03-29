var Q = require('q');


function step1() {
    var defer = Q.defer();

    setTimeout(function() {
        console.log('step 1');
        defer.reject("validation faile");
    }, 1000);

    return defer.promise;
}

function step2() {
        var defer = Q.defer();
        setTimeout(function() {
            console.log('step2 ');
            defer.resolve()
        }, 3000);
        return defer.promise;
}

function step3() {
        var defer = Q.defer();
        setTimeout(function() {
            console.log('step3');
            defer.resolve()
        }, 3000);
        return defer.promise;
}

function error(errorArg) {
    return function() {
        console.log('error: ', errorArg);
    }
}

//
//step1()
//    .then(step2, error('blah at step 2'))
//    .then(step3, error('blah at step 3'))



Q.fcall(step1)
    .then(step2)
    .then(step3)
    .catch(function (error) {
        console.log('error ', error);
        // Handle any error from all above steps
    })
    .done();







