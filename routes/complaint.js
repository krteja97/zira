var express = require('express');
var router = express.Router();

var usermodel = require('../models/User');
var complaintmodel = require('../models/Complaint');
var messagemodel = require('../models/Message');
var executivemodel = require('../models/Executive');


// GET user home page
router.get('/', function(req, res, next) {
	if(req.session.email) {
		complaints_list = new Array();
		hyperlinks_list = [];
		var public_id;

		usermodel.findOne({'email': req.session.email}, '_id' , function(err, users) {
			if(err) {
				console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
				res.status(500).send('somethings fishy');
			}
			else {
				console.log(users);
				public_id = users._id;
			};
					
			//got the user id now get the complaints
			complaintmodel.find( {public_id: public_id}, 'subject', function(err, complaints) {
				if(err) {
					console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
					res.status(500).send('somethings fishy');
				}
				else {
					console.log(public_id );
					for (i = 0; i < complaints.length; i++) {
						hyperlinks_list.push("/user/" + complaints[i]._id);
					};
					console.log(hyperlinks_list);	
				};
				res.render('userhome', { emailid: req.session.email, title: 'Zira! Digitalizing India', 
									complaints_list: complaints , hyperlinks_list: hyperlinks_list});
			});

		});
	}
	else
		res.redirect('/');
});


// GET file a new complaint
router.get('/newcomplaint', function(req, res, next) {
	if(req.session.email) {
		res.render('newcomplaint', {emailid: req.session.email, title: 'Zira! Digitalizing India'});
	}
	else {
		res.redirect('/');
	}
});


// POST file a new complaint
router.post('/newcomplaint', function(req, res, next) {
	if(req.session.email) {
		console.log(req.body);
		var subject = req.body.subject;
		var body = req.body.body;
		var additional = req.body.extra;
		var public_id;

	usermodel.findOne({'email': req.session.email}, '_id' , function(err, users) {
		if(err) {
			console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
			res.status(500).send('somethings fishy');
		}
		else {
			console.log(users);
			public_id = users._id;

			var executives_array = [];

			executivemodel.find({}, '_id', function(err, executives) {
			if(err) {
				console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
				res.status(500).send('somethings fishy');
			}
			else {
				console.log(executives);
				for (i = 0; i < executives.length; i++) {
						executives_array.push(executives[i]._id);
				};
				console.log(executives_array);
				executives_array =  select_executives(executives_array );
				console.log("the returned array is" + executives_array);

				let complaint1 = new complaintmodel({
					subject: subject,
					body: body,
					additional: additional,
					public_id: public_id,
					timestamp: Date.now(),
					executive_ids: executives_array //type the executive id's
				});

				complaint1.save()
					.then(doc => {
						console.log(doc);
					})
				.catch(err => {
					console.log(err)
					});

			};
		});

		};
	}).then(res.redirect('/user'));
	}

	else {
		res.redirect('/');
	}
});



// GET check the status of individual complaints
router.get('/:complaintid', function(req, res, next) {
	if(req.session.email) {
		var complaintid = req.params.complaintid;
		var keys = ['subject', 'body', 'additional', 'timestamp', 'public_id', 'current_status'];
		var executives_names = [];

		complaintmodel.find( {_id: complaintid}, '', function(err, complaints) {
			if(err) {
				console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
				res.status(500).send('somethings fishy');
			}
			else {
				console.log(complaints[0].executive_ids);
				executivemodel.find({_id: { $in: complaints[0].executive_ids }}, 'username', function(err, executives) {
					if(err) {
						console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
						res.status(500).send('somethings fishy');
					}
					else {
						for (i = 0; i < executives.length; i++) {
							executives_names.push(executives[i].username);
						};
						console.log(executives_names);	
						console.log(complaints[0]);
						res.render('complaint', { emailid: req.session.email, title: 'Zira! Digitalizing India', 
									complaint: complaints[0], deletelink: "/user/deletecomplaint/" + complaints[0]._id,
									 executives_names: executives_names, keys: keys});	
					};
				});

			}
		});		
	}	
	else {
		res.redirect('/');
	};
});


router.get('/deletecomplaint/:complaintid', function(req, res, next) {
	if(req.session.email) {
		var complaintid = req.params.complaintid;
		console.log(complaintid + "hello");

		complaintmodel.remove({ _id: complaintid}, function(err) {
			if(err) {
				console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
				res.status(500).send('somethings fishy');
			}
			else {
				res.redirect('/user');
			}
		});

	}	
	else {
		res.redirect('/');
	}
});


function select_executives(arr) {

	//n is number of elements needed
	var n = Math.round(Math.random()*arr.length);
	console.log("the random value is " + n);
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
    console.log(result);
}



async function status_alter() {

	complaint_id_list = [];
	console.log("running status_alter");

	complaintmodel.find( {}, '_id', function(err, complaints) {
				if(err) {
					console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
					res.status(500).send('somethings fishy');
				}
				else {

					console.log("getting all the complaint ids");
					for (i = 0; i < complaints.length; i++) {
						complaint_id_list.push(complaints[i]._id);

						complaintmodel.findOne({_id : complaints[i]._id}, '', async function(err, complaint1) {

							if(err) {
								console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
								res.status(500).send('somethings fishy');
							}


							else {

								console.log("started altering the complaint " + complaint1._id);
								current_status = complaint1.current_status;

								console.log(current_status);
								var new_status = await getStatus(current_status);

								complaintmodel.updateOne({_id: complaint1._id}, {$set: {current_status : new_status}},
									{new :true} , function(err, complaint2) {
									if(err) {
										throw err;
									}
									else {
										console.log("finished altering the complaint " + complaint1._id);
									}
								});	
							}		

						});

					};
					console.log(complaint_id_list );
				}
			

	});

};

function getStatus(current_status) {
	new_status = "hehe";

	if(current_status == 'not opened') {
		new_status = 'opened';
	}
	else if(current_status == 'opened') {
		new_status = 'in process';
	}
	else if(current_status == 'in process') {
		new_status = 'finished';
	}
	else if(current_status == 'finished') {
		// just dont change
		new_status = 'closed';
	}
	else {
		new_status = "permanent close";
	};
	return new_status;
}


setInterval(status_alter, 60000);

module.exports = router;

