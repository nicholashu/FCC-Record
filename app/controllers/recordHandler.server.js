'use strict';


var Records = require('../models/record.js');

function RecordHandler() {

    this.getRecordArray = function(req, res) {

        Records.find({github: {id: req.user.github.id}}).sort({
                _id: -1
            })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);


            });
    };

    this.addRecordNew = function(req, res) {
        var newDoc = new Records({
            github: {
                id: req.user.github.id,
            },
            record: {
              album: req.body.album,
              artist: req.body.artist,
              condition: req.body.condition,
              description: req.body.description,
              owner: req.user.github.id
            }
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
              owner: req.user.github.id
            }}, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

}

module.exports = RecordHandler;
