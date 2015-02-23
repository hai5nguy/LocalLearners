var express = require('express');
var app = express();

//var APP = require('http').createServer(APP);
//var io = require('socket.io')(server);


app.set('port', (process.env.PORT || 5000))

//console.log('testkey', process.env.testkey);
//console.log('testvalue', process.env.testvalue);

app.listen(app.get('port'), function() {
    console.log("Web server running on http://localhost:" + app.get('port'));
});

app.get('/test', function(req, res) {
   res.send('key:' + process.env.testkey + ' value: ' + process.env.testvalue);
});

//APP.use('/test', express.static(__dirname + '/public/test.html?' + process.env.testkey + '=' + process.env.testvalue));
app.use('/', express.static(__dirname + '/public/index.html'));
app.use(express.static(__dirname + '/public'));


//console.log("dirname: ", __dirname);
//APP.use('/bower_components', express.static(__dirname + '/bower_components'));


//io.sockets.on('connection', function(socket) {
//    console.log('user connected');
//    socket.on('message', function(msg) {
//        console.log('heres the fucken message: ', msg);
//    });
//});

