var express = require('express');
var app = express();

//var app = require('http').createServer(app);
//var io = require('socket.io')(server);

var port = process.env.PORT || 5000;


app.listen(port, function() {
    console.log("Web server running on http://localhost:" + port);
});

app.use(express.static(__dirname + '/public'));

app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


//console.log("dirname: ", __dirname);
//app.use('/bower_components', express.static(__dirname + '/bower_components'));


//io.sockets.on('connection', function(socket) {
//    console.log('user connected');
//    socket.on('message', function(msg) {
//        console.log('heres the fucken message: ', msg);
//    });
//});

