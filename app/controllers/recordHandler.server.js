'use strict';


var Records = require('../models/record.js');
var flatten = require('flat')



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
              owner: req.user._id,
              loaner: req.body.loaner
        });


        newDoc.save(function(err, doc) {
            if (err) {
                throw err;
            }

            res.send(doc);
        });


    };

    this.borrowRecord = function(req, res) {

        Records.findOneAndUpdate({
            "_id": req.body.id
        },{
              loaner:req.body.loaner
            }, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

    this.approveRecord = function(req, res) {

        Records.findOneAndUpdate({
            "_id": req.body.id
        },{
              loaner: req.body.loaner,
              approved:req.body.approved
            }, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
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
        },{
              album: req.body.album,
              artist: req.body.artist,
              condition: req.body.condition,
              description: req.body.description,
              owner: req.user._id,
              loaner:req.body.loaner
            }, function(err) {
            if (err) {
                console.log(err)
                throw err;
            }
            res.send(req.body);
        });
    };
}

module.exports = RecordHandler;
