var mongoose = require("mongoose");


var adminScheme = mongoose.Schema({

	
	email: { type: String, required: true },
	password: {
		type: String,
		required: true
	}
});

var Admin = mongoose.model('Admin', adminScheme);
module.exports = Admin;