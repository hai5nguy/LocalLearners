////mongoose nhập khẩu
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;
//
//var CategorySchema = new Schema({
//    id: ObjectId,
//    name: String
//});
//
//var Category = mongoose.model('Category', CategorySchema);
//
//mongoose.connect('mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa');
//
//
//exports.Category = Category;
//
//
//


module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var CategorySchema = new Schema({
        id: ObjectId,
        name: String
    });

    var UpcomingClassSchema = new Schema({
        id: ObjectId,
        eventId: String,
        category: String
    });

    return {
        Category: mongoose.model('Category', CategorySchema),
        UpcomingClass: mongoose.model('UpcomingClass', UpcomingClassSchema)
    }
}