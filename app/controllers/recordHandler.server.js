'use strict';


var Records = require('../models/record.js');




function RecordHandler() {

    this.getRecordArray = function(req, res) {

        Records.find().sort({
                _id: -1
            })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);


            });
    };

    this.addRecordNew = function(req, res) {
        var newDoc = new Records({
              album: req.body.album,
              artist: req.body.artist,
              condition: req.body.condition,
              description: req.body.description,
              owner: req.user._id
        });


        newDoc.save(function(err, doc) {
            if (err) {
                throw err;
            }

            res.send(doc);
        });


    };



    this.removeRecord = function(req, res) {
        Records.findOneAndRemove({
            "_id": req.params.id
        }, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

    this.editRecord = function(req, res) {
        Records.findOneAndUpdate({
            "_id": req.body.id
        }, {record: {
              album: req.body.album,
              artist: req.body.artist,
              condition: req.body.condition,
              description: req.body.description,
              owner: req.user._id
            }}, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };


     this.editUser = function(req, res) {
        Users.findOneAndUpdate({
        "_id": req.body.id
        }, {
        local: {
        email : req.body.email,
        },
       shared: {
        name: req.body.name,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
       }},
       function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

}

module.exports = RecordHandler;
