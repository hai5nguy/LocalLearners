global.MEETUP_API_ENDPOINT = 'http://localhost:5000/fakemeetupapi';
//global.MEETUP_API_ENDPOINT = 'https://api.meetup.com/2';

require('./core.js');

var express = require('express');
global.APP = express();

APP.set('LOCALLEARNERSENVIRONMENT', (process.env.LOCALLEARNERSENVIRONMENT || 'development'));
APP.set('port', (process.env.PORT || 5000));

require('./meetup-api.js')(APP);
require('./authenticate.js')(APP);
require('./routes/routes.js')(APP);

APP.use(express.static(__dirname + '/public'));
APP.use('/*', express.static(__dirname + '/public/index.html'));  //this is needed to remove hash from url

globalEventEmitter.on('test', function() {
    console.log('test event called');
});

APP.listen(APP.get('port'), function() {
    console.log("Web server running on http://localhost:" + APP.get('port'));
});
