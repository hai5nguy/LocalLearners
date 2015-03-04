module.exports = function (app) {
    //please add routes in alphatically order, thank you! -hai nagooyen

    require('./logout.js')(app);
    require('./profile.js')(app);
    require('./upcomingclasses.js')(app);
    require('./requestedclasses.js')(app);
    require('./categories.js')(app);
    require('./testing.js')(app);
    require('./fakemeetupapi.js')(app);

}
