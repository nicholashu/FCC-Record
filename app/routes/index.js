'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

var TodoHandler = require(path + '/app/controllers/todoHandler.server.js');

var RecordHandler = require(path + '/app/controllers/recordHandler.server.js');


module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	var todoHandler = new TodoHandler();

	var recordHandler = new RecordHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/record/record.html');
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

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.put(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
	app.route('/api/:id/todo')
		.get(todoHandler.getTodosArray)
		.post(todoHandler.addTodoNew)
		.put(todoHandler.editTodo);


 app.route('/api/:id/todo/:id')
		.delete(todoHandler.removeTodo);

 app.route('/api/:id/record')
		.get(recordHandler.getRecordArray)
		.post(recordHandler.addRecordNew)
		.put(recordHandler.editRecord);


	app.route('/api/:id/record/:id')
		.delete(recordHandler.removeRecord);
		
		
};
