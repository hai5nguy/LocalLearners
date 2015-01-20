module.exports = function (app) {

    app.get('/logout', function (req, res) {
        req.session.destroy();
        //possible TODO: add logout timestamp to DB
    });

}