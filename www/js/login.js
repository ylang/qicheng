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
});