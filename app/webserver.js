global.MEETUP_API_ENDPOINT = 'http://localhost:5000/fakemeetupapi';
//global.MEETUP_API_ENDPOINT = 'https://api.meetup.com/2';

require('./core.js');

var express = require('express');
var app = express();

app.set('LOCALLEARNERSENVIRONMENT', (process.env.LOCALLEARNERSENVIRONMENT || 'development'));
app.set('port', (process.env.PORT || 5000));

require('./authenticate.js')(app);
require('./routes/routes.js')(app);

app.use(express.static(__dirname + '/public'));
app.use('/*', express.static(__dirname + '/public/index.html'));  //this is needed to remove hash from url

app.listen(app.get('port'), function() {
    console.log("Web server running on http://localhost:" + app.get('port'));
});
