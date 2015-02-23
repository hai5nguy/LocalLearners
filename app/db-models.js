module.exports = function (mongoose) {
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

    var FakeEventSchema = new Schema({
        visibility: String,
        status: String,
        maybe_rsvp_count: Number,
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

    var MemberSchema = new Schema({
        memberId: Number
    });

    return {
        Category: mongoose.model('Category', CategorySchema),
        UpcomingClass: mongoose.model('UpcomingClass', UpcomingClassSchema),
        FakeEvent: mongoose.model('FakeEvent', FakeEventSchema),
        Member: mongoose.model('Member', MemberSchema)
    }
}