'use strict';



var Users = require('../models/user.js');
var flatten = require('flat')


function UserHandler() {

     this.editUser = function(req, res) {
        Users.findOneAndUpdate({
        "_id": req.body.id
        },flatten( {
        local: {
        email : req.body.email,
		    },
			 shared: {
				name: req.body.name,
				country: req.body.country,
		    state: req.body.state,
		    city: req.body.city
			 }}),
			 function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

}

module.exports = UserHandler;
