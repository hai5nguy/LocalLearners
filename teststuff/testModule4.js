require('../app/core.js');
var Q = require('../node_modules/q');

function Module4() {

    return {
        blah: FCALLWRAPPER(blah),    //return function takes a context and context
    };
    

    function blah(context, resolve, reject, notify) {
        resolve(context);
	}
}


module.exports = Module4();



