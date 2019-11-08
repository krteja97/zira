var express = require('express');
var router = express.Router();

var executivemodel = require('../models/Executive');

//GET for executive page
router.get('/', function(req, res, next) {
	res.render('executiveregister', { title: 'Zira! Digitalizing India'} );
});

// Executive register page
// Not influenced by User as per Ideals
// POST Register Page
router.post('/', function(req, res, next){
	console.log(req.body);
	var name = req.body.name;
	var username = req.body.username;
	var date_of_birth = req.body.date_of_birth;
	var password = req.body.password;
	var designation = req.body.designation;
	
	let executive1 = new executivemodel({
		name: name,
		username: username,
		date_of_birth: date_of_birth,
		password: password,
		designation: designation

	});

		executive1.save()
			.then(doc => {
				console.log(doc);
			})
		.catch(err => {
			console.log(err)
		});

	res.redirect('/');
});

module.exports = router;

//not possible because you know... database is not connected