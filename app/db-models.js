var mongooseAutoIncrement = require('mongoose-auto-increment');

module.exports = function (mongoose) {
    
    mongooseAutoIncrement.initialize(mongoose.connection);

    var Schema = mongoose.Schema;
//    var ObjectId = Schema.ObjectId;

    var CategorySchema = new Schema({
        name: String,
        value: String,
        imageUrl: String
    });

    var UpcomingClassSchema = new Schema({
        eventId: String,
        category: {
            name: String,
            value: String,
            imageUrl: String
        }
    });
    
    var RequestedClassSchema = new Schema({
        requestedId: Number,
        name: String,
        category: {
            name: String,
            value: String,
            imageUrl: String
        },
        interestedMembers: Array
    });
    RequestedClassSchema.plugin(mongooseAutoIncrement.plugin, {
        model: 'RequestedClass',
        field: 'requestedId',
        startAt: 1
    });

    var UserSchema = new Schema({
        userId: Number,
        meetupId: Number,
        name: String,
		accessToken: String,
        thumbLink: String
    });
    UserSchema.plugin(mongooseAutoIncrement.plugin, {
        model: 'User',
        field: 'userId',
        startAt: 1
    });

    //<editor-fold desc="Development ////////////////////////////////////////////////////////////////////////////////////////////////">
    var FakeEventSchema = new Schema({
        visibility: String,
        status: String,
        maybe_rsvp_count: Number,
        event_hosts: Array,
        utc_offset: Number,
        id: String,
        time: Date,
        announced: Boolean,
        waitlist_count: Number,
        created: Date,
        yes_rsvp_count: Number,
        updated: Date,
        event_url: String,
        headcount: Number,
        name: String,
        group: {
            id: Number,
            created: Date,
            group_lat: Number,
            name: String,
            group_lon: Number,
            join_mode: String,
            urlname: String,
            who: String
        }
    });
    //</editor-fold>

    return {
        Category: mongoose.model('Category', CategorySchema),
        UpcomingClass: mongoose.model('UpcomingClass', UpcomingClassSchema),
        FakeEvent: mongoose.model('FakeEvent', FakeEventSchema),
        User: mongoose.model('User', UserSchema),
        RequestedClass: mongoose.model('RequestedClass', RequestedClassSchema)
    }
}
