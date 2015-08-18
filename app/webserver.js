require('./environmentals.js');
require('./debug.js');
require('./core.js');

var express = require('express');
global.THE_APP = express();

require('./locallearnersmodules.js');
require('./routes.js');

THE_APP.use(express.static(__dirname + '/public'));
THE_APP.use('/*', express.static(__dirname + '/public/index.html'));  //this is needed to remove hash from url

var port = process.env.PORT || 5000;

THE_APP.listen(port, function() {
    console.log("Web server running on http://localhost:" + port);
});
