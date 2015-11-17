    'use strict';


var Todos = require('../models/todo.js');

function TodoHandler() {

    this.getTodosArray = function(req, res) {

        Todos.find({github: {id: req.user.github.id}}).sort({
                _id: -1
            })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);


            });
    };

    this.addTodoNew = function(req, res) {
        var newDoc = new Todos({
            github: {
                id: req.user.github.id,
            },
            todo: {
                title: req.body.title,
                message: req.body.message
            }
        });


        newDoc.save(function(err, doc) {
            if (err) {
                throw err;
            }

            res.send(doc);
        });


    };



    this.removeTodo = function(req, res) {

        Todos.findOneAndRemove({
            "_id": req.params.id
        }, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

    this.editTodo = function(req, res) {
        Todos.findOneAndUpdate({
            "_id": req.body.id
        }, {todo: {
                title: req.body.title,
                message: req.body.message
            }}, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

}

module.exports = TodoHandler;
