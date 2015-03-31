module.exports = function (app) {
    //please add routes in alphatically order, thank you! -hai nagooyen
    
    //authentication related routes are in authentication.js
    
    require('./profile.js')(app);
    require('./upcoming.js')(app);
    require('./requested.js')(app);
    require('./categories.js')(app);
    require('./testing.js')(app);
    require('./fakemeetupapi.js')(app);

}
