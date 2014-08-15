module.exports = function register(app) {
    app.get('/login', function(req, res) {
            res.render('login', {
                title: 'loginpage'
            });
    });
};
