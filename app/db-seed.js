var categorySeeds = [
    { name: 'N/A'},
    { name: 'Technology' },
    { name: 'Music' },
    { name: 'Automotive' } //TODO: add the rest
];


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CategorySchema = new Schema({
    id: ObjectId,
    name: String
});

mongoose.connect('mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa');


var db = mongoose.connection;

db.on('error', function() {
    console.log('shitez is wrong with database, tell hai');
});

db.once('open', function() {
    console.log('yay, we are connected to the db');
});

var Category = mongoose.model('Category', CategorySchema);

for (var i = 0; i < categorySeeds.length; i++) {
    var c = new Category(categorySeeds[i]);
    c.save(function(err, c, numberAffected) {
        if (err) {
            console.log("error in seeding Category");
        }
    });
}


