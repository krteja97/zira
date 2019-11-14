var express = require('express');
var router = express.Router();

var usermodel = require('../models/User');
var adminmodel = require('../models/Admin');
var complaintmodel = require('../models/Complaint');


// GET admin Login page
router.get('/login', function(req, res, next) {
	if(req.session.email) {
  		res.redirect('/admin/dashboard');
  		res.end();
  	}
  	else {
		res.render('adminLogin', { title: 'Zira! Digitalizing India', isLoggedIn: false});
	}
});


// POST admin login page
router.post('/login', function(req, res, next) {
	console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;

	adminmodel.find({'email': email, 'password': password}, 'name email', function(err, users) {
		if(err) {
			return handleError(err);
		}

		users.push({
			email: email
		});

		if (users.length == 0) {
			res.redirect(401, "/admin/login");
			return;
		} else {
			req.session.email = req.body.email;
			req.session.isAdmin = true;
			console.log(req.session);
		}
		res.redirect('/admin/dashboard');
	});
});


// GET logout request
router.get('/logout', function(req, res, next) {
	if(req.session.email) {
		req.session.destroy(function(err) {
      		if(err) {
        		return next(err);
      		} else {
        		res.redirect('/');
      		}
    	});
	}
	else {
		res.redirect('/');
	}
});



// GET user home page
router.get('/dashboard', function(req, res, next) {
	if(req.session.email) {
		complaints_list = new Array();
		hyperlinks_list = [];
		var public_id;

		//got the user id now get the complaints
		complaintmodel.find( {}, '', function(err, complaints) {
			let responseComplaints = [];
			if(err) {
				res.status(500).send('somethings fishy');
			}
			else {
				for (i = 0; i < complaints.length; i++) {
					responseComplaints.push({});
					let id = complaints[i]._id.toString();
					id = id.substr(id.length - 3);
					responseComplaints[i].id = id;
					responseComplaints[i].hyperlink = "/admin/" + complaints[i]._id;
					responseComplaints[i].subject = complaints[i].subject;
					responseComplaints[i].current_status = complaints[i].current_status;
				};
			};
			console.log(responseComplaints);
			res.render('adminDashboard', {
				emailid: req.session.email,
				title: 'Zira! Digitalizing India', 
				isLoggedIn: true,
				complaints_list: responseComplaints
			});
		});
	}
	else
		res.redirect('/');
});



// GET check the status of individual complaints
router.get('/:complaintid', function(req, res, next) {
	if(req.session.email) {

		var complaintid = req.params.complaintid;
		var keys = ['subject', 'body', 'additional', 'timestamp', 'public_id', 'current_status'];
		
		complaintmodel.find( {_id: complaintid}, '', function(err, complaints) {
			if(err) {
				console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
				res.status(500).send('somethings fishy');
			}
			else {
				
				console.log(complaints[0]);
				res.render('adminComplaint', {
					emailid: req.session.email,
					title: 'Zira! Digitalizing India',
					isLoggedIn: true,
					complaint: complaints[0],
					keys: keys,
					complaint_id: complaintid
				});
			}
		});		
	}	
	else {
		res.redirect('/');
	};
});

router.get('/delete/:complaintid', function(req, res, next) {
	if(req.session.email) {
		var complaintid = req.params.complaintid;
		console.log(complaintid);

		complaintmodel.remove({
			_id: complaintid
		}, function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.redirect('/admin/dashboard');
			}
		});
	}
	else {
		res.redirect('/');
	};
});


//GET update complaint status
router.get('/:complaintid/updatestatus/:status', function(req, res, next) {
	if(req.session.email) {
		var complaintid = req.params.complaintid;
		console.log(req.body, req.params);
		var new_status = req.params.status;
		console.log(new_status);
		console.log(complaintid + "hello");

		complaintmodel.updateOne( {_id: complaintid}, {$set: {current_status: new_status}},
									{new: true}, function(err, complaint1) {
										if(err) {
											throw err;
										}
										else {
											console.log("finished altering the complaint " );
											res.redirect('/admin/dashboard');
										}
		});
	}	
	else {
		res.redirect('/dashboard');
	}

});


module.exports = router;