require('../app/core.js');
var Database = require('../app/Modules/Database.js');
var D = require('../app/Modules/Database.js');

var r1 = new Database.UpcomingClassRecord({ test: 'r1' });
var r2 = new Database.UpcomingClassRecord();


console.log(D === Database);

console.log(D);

