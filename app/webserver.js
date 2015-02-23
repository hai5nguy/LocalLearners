global.MEETUP_API_ENDPOINT = 'http://localhost:5000/fakemeetupapi';
//global.MEETUP_API_ENDPOINT = 'https://api.meetup.com/2';

require('./core.js');

var express = require('express');
global.THE_APP = express();

THE_APP.set('LOCALLEARNERSENVIRONMENT', (process.env.LOCALLEARNERSENVIRONMENT || 'development'));

require('./meetup-api.js')(THE_APP);
require('./authenticate.js')(THE_APP);
require('./routes/routes.js')(THE_APP);

THE_APP.use(express.static(__dirname + '/public'));
THE_APP.use('/*', express.static(__dirname + '/public/index.html'));  //this is needed to remove hash from url

var port = process.env.PORT || 5000;

THE_APP.listen(port, function() {
    console.log("Web server running on http://localhost:" + port);
});
