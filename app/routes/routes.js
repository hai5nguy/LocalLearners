module.exports = function (app) {
    require('./profile.js')(app);
    require('./logout.js')(app);
}
