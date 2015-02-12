var jsonServer = require('json-server');

var db = {
    "tests": [
        {
            "id": 1,
            "name": "name1"
        },
        {
            "id": 2,
            "name": "name2"
        }
    ]
};

var router = jsonServer.router(db);
var server = jsonServer.create();
server.use(router);

var port = 4000;
server.listen(port);
console.log('Fake meetup api running on http://localhost:' + port);