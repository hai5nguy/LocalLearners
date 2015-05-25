var Context = require('../app/Modules/Context.js');

var c1 = new Context();
c1.UpcomingClass.class = 'class1';
var c2 = new Context();
console.log(c1.UpcomingClass.class);
console.log(c2.UpcomingClass.class);
c2.UpcomingClass.class = 'class2';
console.log(c1.UpcomingClass.class);
console.log(c2.UpcomingClass.class);

