module.exports = function(app) {
    app.get('/', function(req, res) {
        var name = req.user? req.user.name: null;
        res.render('index', {
            'function': 'base',
            'userDisplayName': name
        });
    });
}