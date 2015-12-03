		'use strict';

		var path = process.cwd();

		var RecordHandler = require(path + '/app/controllers/recordHandler.server.js');
		var UserHandler = require(path + '/app/controllers/userHandler.server.js'); 

		module.exports = function (app, passport) {

		function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
		return next();
		} else {
		res.redirect('/login');
		}
		}

		var recordHandler = new RecordHandler();
		var userHandler = new UserHandler();

		app.route('/')
		.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/record/record.html', { message: req.flash('loginMessage') });
		});


		//ROUTE TO USER PROFILE
		app.route('/api/profile')
		.put(userHandler.editUser, function(req,res){
			console.log(res)
			res.sendFile(path + '/public/profile.html');
		});

		app.route('/hi')
		.get(function(req,res){
			console.log("hi")
		});

		app.route('/newrecord')
		.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/record/newrecord.html');
		});

		app.route('/r/:id')
		.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/record/recordpage.html');
		});

		app.route('/:userId/records')
		.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/record/myrecords.html');
		});


		app.route('/login')
		.get(function (req, res) {
		res.sendFile(path + '/public/login.html');
		});

		app.route('/signup')
		.get(function (req, res) {
		res.sendFile(path + '/public/signup.html', { message: req.flash('signupMessage') });
		});

		app.route('/logout')
		.get(function (req, res) {
		req.logout();
		res.redirect('/login');
		});

		app.route('/profile')
		.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/profile.html');
		})
		.patch(isLoggedIn, function(req,res){
		successRedirect : '/profile'
		});


		app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
		res.json(req.user);
		});

		app.route('/auth/github')
		.get(passport.authenticate('github'));

		app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
		}));

		app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
		}));

		app.post('/login',
		passport.authenticate('local-login'),
		function(req, res) {
		res.redirect('/' + req.user);
		});

		app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
		}));


		app.route('/api/:id/record')
		.get(recordHandler.getRecordArray)
		.post(recordHandler.addRecordNew)
		.put(recordHandler.editRecord);

		app.route('/api/record/borrow')
		.put(recordHandler.borrowRecord);


		app.route('/api/:id/record/:id')
		.delete(recordHandler.removeRecord);


		};
