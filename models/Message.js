var mongoose = require("mongoose");

var messageScheme = mongoose.Schema({

	//_id: mongoose.Schema.Types.ObjectId,
	isUser: {
		type: Boolean,
		default: false
	},
	posterId: mongoose.Schema.Types.ObjectId,
	message_body: String,
	timestamp: Date
	
});

var Message = mongoose.model('Message', messageScheme);
module.exports = Message;