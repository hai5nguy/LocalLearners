module.exports = function (app) {

    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            //res.(req);
            console.log();
            var user = {
                meetupId: req.user.meetupId,
                name: req.user.name,
                thumbLink: req.user.thumbLink
            };
            res.json(user);
        } else {
            res.json({});
        }
    });

}