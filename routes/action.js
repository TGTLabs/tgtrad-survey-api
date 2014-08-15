module.exports = function register(app) {
    app.get('/action', function(req, res) {
            res.render('action', {
                title: 'actionpage'
            });
    });
};
