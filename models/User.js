var mongoose = require("mongoose");

var userScheme = mongoose.Schema({

	//_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true
	},
	date_of_birth: {
		type: Date,
	},
	address: {
		doorNo: String,
		street: String,
		Block: String,
		Tehsil: String,
		District: String,
		PIN: String,
	},
	email: { type: String, required: true },
	password: {
		type: String,
		required: true
	},
	mobile: String
});

var User = mongoose.model('User', userScheme);
module.exports = User;