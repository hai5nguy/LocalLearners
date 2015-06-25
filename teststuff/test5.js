var Context = require('../app/Modules/Context.js');

var c1 = new Context();
c1.set('id', 'cone');;
var c2 = new Context();
c2.set('id', 'ctwo');

console.log(c1.get('id'), c2.get('id'));
