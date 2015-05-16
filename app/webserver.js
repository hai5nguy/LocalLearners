require('./environmentals.js');
require('./debug.js');
require('./core.js');

var express = require('express');
global.THE_APP = express();

require(LL_MODULES_DIR + '/Database.js');
//require('./modules/MeetupApi.js');
require('./meetup-sync.js')(THE_APP);
require(LL_MODULES_DIR + 'Authentication.js');
require('./routes/routes.js')(THE_APP);

THE_APP.use(express.static(__dirname + '/public'));
THE_APP.use('/*', express.static(__dirname + '/public/index.html'));  //this is needed to remove hash from url

var port = process.env.PORT || 5000;

THE_APP.listen(port, function() {
    console.log("Web server running on http://localhost:" + port);
});
