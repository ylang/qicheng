module.exports = function(app) {
    app.get('/', function(req, res) {
        var email = req.user? req.user.email: null;
        res.render('index', {
            'function': 'base',
            'userEmail': email
        });
    });
}