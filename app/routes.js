module.exports = (function (app) {
    //please add routes in alphatically order, thank you! -hai nagooyen
    
    //authentication related routes are in authentication.js
    
    var routesPath = './routes/';

    require(routesPath + 'profile.js');
    require(routesPath + 'upcoming.js');
    require(routesPath + 'requested.js');
    require(routesPath + 'category.js');
    // require(routesPath + 'testing.js')(app);
    // require(routesPath + 'fakemeetupapi.js')(app);

})();
