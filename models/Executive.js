var mongoose = require("mongoose");


var executiveScheme = mongoose.Schema({

	//_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true
	},
	date_of_birth: {
		type: Date,
		required: true 
	},
	username: { type: String, required: true },
	password: {
		type: String,
		required: true
	},

	designation: {
		required: true,
		type: String, //vro?vra?mro?s
	}
});

var Executive = mongoose.model('Executive', executiveScheme);
module.exports = Executive;