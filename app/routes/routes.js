module.exports = function (app) {
    //please add routes in alphatically order, thank you! -hai nagooyen
    
    //authentication related routes are in authentication.js
    
    require('./profile.js')(app);
    require('./upcoming.js')(app);
    require('./requested.js');
    require('./categories.js');
    require('./testing.js')(app);
    require('./fakemeetupapi.js')(app);

}
