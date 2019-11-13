var express = require('express');
var router = express.Router();

var usermodel = require('../models/User');
var adminmodel = require('../models/Admin');
var complaintmodel = require('../models/Complaint');


// GET admin Login page
router.get('/login', function(req, res, next) {
	if(req.session.email) {
  		res.redirect('/admin/');
  		res.end();
  	}
  	else
		res.render('adminlogin', { title: 'Zira! Digitalizing India'});
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
		console.log("Blloom", users.length);
		if (users.length == 0) {
			res.redirect(401, "/");
			return;
		} else {
			console.log(users);
			req.session.email = email;
			console.log(req.session);
		}
		res.redirect('/admin/');
	});
	//res.send("user login done");
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
router.get('/', function(req, res, next) {
	if(req.session.email) {
		complaints_list = new Array();
		hyperlinks_list = [];
		var public_id;

			
			//got the user id now get the complaints
			complaintmodel.find( {}, '', function(err, complaints) {
				if(err) {
					console.log("sayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyf");
					res.status(500).send('somethings fishy');
				}
				else {

					for (i = 0; i < complaints.length; i++) {
						hyperlinks_list.push("/admin/" + complaints[i]._id);
					};
					console.log(hyperlinks_list);	
				};
				res.render('adminhome', { emailid: req.session.email, title: 'Zira! Digitalizing India', 
									complaints_list: complaints , hyperlinks_list: hyperlinks_list});
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
				res.render('complaint', { emailid: req.session.email, title: 'Zira! Digitalizing India', 
									complaint: complaints[0], keys: keys});	
			}
		});		
	}	
	else {
		res.redirect('/');
	};
});

//GET update complaint status
router.get('/:complaintid/updatestatus', function(req, res, next) {
	if(req.session.email) {
		var complaintid = req.params.complaintid;
		var new_status = req.params.new_status;
		console.log(complaintid + "hello");

		complaintmodel.updateOne( {_id: complaintid}, {$set: {current_status: new_status}},
									{new: true}, function(err, complaint1) {
										if(err) {
											throw err;
										}
										else {
											console.log("finished altering the complaint " );
											res.redirect('/admin');
										}
		});
	}	
	else {
		res.redirect('/');
	}

});


module.exports = router;