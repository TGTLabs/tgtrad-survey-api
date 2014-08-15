module.exports = function register(app) {
    app.get('/question/new', function(req, res) {
            res.render('newquestion', {
                title: 'newquestion'
            });
    });
};
