var express = require('express');
var router = express.Router();

var usermodel = require('../models/User');
var executivemodel = require('../models/Executive');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.email) {
  	res.redirect('/user');
  	res.end();
  }
  else
  	res.render('home', { title: 'Zira! Digitalizing India' });
  //parameters can be sent from here
});

// GET Register Page
router.get('/register', function(req, res, next) {
	if(req.session.email) {
  		res.redirect('/user');
  		res.end();
    }
    else
		res.render('register', { title: 'Zira! Digitalizing India'} );
});

// GET User Login page
router.get('/userLogin', function(req, res, next) {
	if(req.session.email) {
  		res.redirect('/user');
  		res.end();
  	}
  	else
		res.render('userlogin', { title: 'Zira! Digitalizing India'});
});




// POST Register Page
router.post('/register', function(req, res, next){
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var mobile = req.body.mobile;
	var password = req.body.password;
	
	let user1 = new usermodel({
		name: name,
		email: email,
		mobile: mobile,
		password: password

	});

	user1.save()
		.then(doc => {
			console.log(doc)
	})
	.catch(err => {
		console.log(err)
	});

	res.render('userlogin', { title: 'Zira! Digitalizing India'});
});

// POST user login page
router.post('/userLogin', function(req, res, next) {
	console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;

	usermodel.find({'email': email, 'password': password}, 'name email', function(err, users) {
		if(err) {
			return handleError(err);
		}
		console.log("Blloom", users.length);
		if (users.length == 0) {
			res.redirect(401, "/user");
			return;
		} else {
			console.log(users);
			req.session.email = email;
			console.log(req.session);
		}
		res.redirect('/user');
	});
	//res.send("user login done");
});






// GET logout request
router.get('/userLogout', function(req, res, next) {
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
module.exports = router;	