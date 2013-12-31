module.exports = function(app) {
    app.get('/', function(req, res) {
        var isAuth = req.user? true: false;
        var name = isAuth? req.user.name: null;
        var page = req.query.page || 'home';
        res.render('index', {
            'function': 'base',
            'userDisplayName': name,
            'page': page
        });
    });
}