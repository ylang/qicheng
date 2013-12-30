var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var QcUser = new Schema({
	name: String,
	weiboId: String
});

var localMongooseOptions = {
	usernameField: 'email'
}
QcUser.plugin(passportLocalMongoose, localMongooseOptions);

module.exports = mongoose.model('QcUser', QcUser);