var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    var upcomingClasses = db.collection('upcomingclasses');

    upcomingClasses.find({}).toArray(function (a,b) {
        console.log(a, '111', b.length);
    });

    //db.close();
});