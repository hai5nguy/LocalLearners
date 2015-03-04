var Q = require('q');


function step1(step1arg) {
    var defer = Q.defer();

    setTimeout(function() {
        console.log('step 1');

        for (var i = 0; i < 10; i++ ) {
            console.log('i: ', i);
            if (i > 5) {
                defer.reject();
                break;
            }
        }
        defer.resolve();
    }, 1000);

    return defer.promise;
}

function step2(step2arg) {
    var defer = Q.defer();
    setTimeout(function() {
        console.log('step2 ', step2arg);
        defer.resolve()
    }, 3000);
    return defer.promise;
}

function step3(step3arg) {
    var defer = Q.defer();
    setTimeout(function() {
        console.log('step3');
        defer.resolve()
    }, 3000);
    return defer.promise;
}

function s(num) { console.log('success ', num) }
function f(num) { console.log('fail ', num) }

step1().then(function() {
    s(1);
}, function() {
    f(1);
});





