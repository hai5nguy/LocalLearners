var Q = require('q');


function step1(step1arg) {
    var defer = Q.defer();

    setTimeout(function() {
        console.log('step1');
        defer.resolve('returnfromstep1')
    }, 3000);

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

var blah;
step1().then(
    function(a) {
        blah = a;
    },
    function() {

    }
).then(
    function() {
        step2(blah);
        console.log('success 2');
    },
    function () {
        console.log('fail 2');
    }
)

