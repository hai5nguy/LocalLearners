module.exports = function (mongoose) {
    
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var CategorySchema = new Schema({
        name: String,
        value: String,
        imageUrl: String
    });

    var UpcomingClassSchema = new Schema({
        category: { type: ObjectId, ref: 'Category' },
        meetupEvent: Object,
        teachers: [{ type: ObjectId, ref: 'User' }]
    });
    
    var RequestedClassSchema = new Schema({
        name: String,
        category: { type: ObjectId, ref: 'Category' },
        requester: { type: ObjectId, ref: 'User' },
        interestedUsers: [{ type: ObjectId, ref: 'User' }]
    });

    var UserSchema = new Schema({
        accessToken: String,
        meetupProfile: Object
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
        FakeEvent: mongoose.model('FakeEvent', FakeEventSchema),
        RequestedClass: mongoose.model('RequestedClass', RequestedClassSchema),
        UpcomingClass: mongoose.model('UpcomingClass', UpcomingClassSchema),
        User: mongoose.model('User', UserSchema)
    }
    
}
