'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Record = new Schema({
	github: {
    id: String,
   },
  record:{
		album: String,
	  artist: String,
	  condition: Number,
	  description: String,
	  owner: String,
	  loaner: String,
	  active: Boolean,
	  approved:{ 
	    type: Boolean,
	    default: false
	  }
  }
});

module.exports = mongoose.model('Record', Record);
