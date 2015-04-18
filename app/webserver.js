global.MEETUP_API_ENDPOINT = 'http://localhost:5000/fakemeetupapi';
//global.MEETUP_API_ENDPOINT = 'https://api.meetup.com/2';

require('./debug.js');
require('./core.js');
require('./environmentals.js');

var express = require('express');
global.THE_APP = express();

require('./db.js')(THE_APP);
require('./meetup-api.js')(THE_APP);
require('./meetup-sync.js')(THE_APP);
require('./authentication.js')(THE_APP);
require('./routes/routes.js')(THE_APP);

THE_APP.use(express.static(__dirname + '/public'));
THE_APP.use('/*', express.static(__dirname + '/public/index.html'));  //this is needed to remove hash from url

var port = process.env.PORT || 5000;

THE_APP.listen(port, function() {
    console.log("Web server running on http://localhost:" + port);
});
