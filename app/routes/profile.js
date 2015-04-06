module.exports = function (app) {

    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            var user = {
                _id: req.user._id,
                meetupProfile: req.user.meetupProfile
            };
            res.json(user);
        } else {
            res.json({});
        }
    });

}