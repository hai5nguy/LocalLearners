module.exports = function (app) {

    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            //res.(req);
            console.log();
            var user = {
                _id: req.user._id,
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