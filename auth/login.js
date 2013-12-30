var passport = require('passport');
var QcUser = require('../model/QcUser');
module.exports = function(app) {
	app.post('/auth/signup', function(req, res) {
		var email = req.body.email;
		console.log("POST /signup");
		console.log("email = " + email);
		QcUser.findOne({
			email: email
		}, function(err, existingUser) {
			console.log("Checking email...");
			if (err) {
				console.log("err: " + err);
				return res.send({
					'err': err
				});
			}
			if (existingUser) {
				console.log("email already exists");
				return res.send('user exists');
			}
			console.log("email available");
			var user = new QcUser({
				email: req.body.email,
				name: req.body.fullName
			});
			user.setPassword(req.body.password, function(err) {
				if (err) {
					console.log("err: " + err);
					return res.send({
						'err': err
					});
				}

				user.save(function(err) {
					if (err) {
						console.log("err: " + err);
						return res.send({
							'err': err
						});
					}
					console.log("sign up success!");
					return res.send('success');
				});
			});
		});
	});

	app.post('/auth/login', passport.authenticate('local'), function(req, res) {
		req.user.save();
		res.redirect('/');
	});

	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/auth/weibo', passport.authenticate('weibo'), function(req, res) {
		// The request will be redirected to weibo for authentication, so this
		// function will not be called.
	});

	// GET /auth/weibo/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/weibo/callback',
		passport.authenticate('weibo', {
			failureRedirect: '/login'
		}),
		function(req, res) {
			res.redirect('/');
		});

}