$(document).ready(function() {

	$('#signup-form').validate({
		rules: {
			name: {
				minlength: 2,
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				minlength: 6,
				required: true
			},
			passwordRetype: {
				minlength: 6,
				required: true,
				equalTo: '#signup-password-input'
			}
		},
		highlight: function(element) {
			$(element).closest('.form-group').removeClass('success').addClass('error');
		},
		success: function(element) {
			element.text('OK!').addClass('valid')
				.closest('.form-group').removeClass('error').addClass('success');
		}
	});

	$('#login-form').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				minlength: 6,
				required: true
			},
		},
		highlight: function(element) {
			$(element).closest('.control-group').removeClass('success').addClass('error');
		},
		success: function(element) {
			element.text('OK!').addClass('valid')
				.closest('.control-group').removeClass('error').addClass('success');
		}
	});

	WB2.anyWhere(function(W) {
		W.widget.connectButton({
			id: "wb_connect_btn",
			type: '1,1',
			callback: {
				login: function(o) { //登录后的回调函数
					alert("login: " + o.screen_name)
					QcUsers.findOne({
						weiboId: o.id
					}, function(err, oldUser) {
						if (err) throw err;
						if (oldUser) {
							done(null, oldUser);
						} else {
							var newUser = new QcUsers({
								weiboId: o.id,
								email: o.emails[0].value,
								name: o.screen_name
							}).save(function(err, newUser) {
								if (err) throw err;
								done(null, newUser);
							});
						}
					});
				},
				logout: function() { //退出后的回调函数
					alert('logout');
				}
			}
		});
	});
});