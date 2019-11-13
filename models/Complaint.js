var mongoose = require("mongoose");

var complaintScheme = mongoose.Schema({

	//_id: mongoose.Schema.Types.ObjectId,
	public_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	subject: {
		required: true,
		type: String
	},

	body: {
		required: true,
		type: String
	},

	additional: String,
	timestamp: Date,
	//executive id's must be placed here
	executive_ids: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Executive'
	}],

	current_status: {
		type: String,
		default: 'not opened',
	},

	//message id's must be placed here
	message_ids: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Message'
	}]
});

var Complaint = mongoose.model('Complaint', complaintScheme);
module.exports = Complaint;