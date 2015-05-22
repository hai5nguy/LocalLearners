//var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');

module.exports = (function () {
	var app = THE_APP;
    
    app.get('/api/profile', function(req, res) {
//        debug(FUNCTIONALITY.api_profile_get, 'GET /api/profile', { req: req });
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

})();