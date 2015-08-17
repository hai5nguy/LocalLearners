module.exports = function (app) {
    //please add routes in alphatically order, thank you! -hai nagooyen
    
    //authentication related routes are in authentication.js
    
    require('./profile.js');
    require('./upcoming.js');
    require('./requested.js');
    require('./category.js');
    require('./testing.js')(app);
    require('./fakemeetupapi.js')(app);

}
