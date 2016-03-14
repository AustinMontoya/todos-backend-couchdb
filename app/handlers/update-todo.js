"use strict";

const utils = require('../utils');
const db = require('../db');

const formatTodo = utils.formatTodo;
const wrap = utils.wrap;

function updateTodo(req, res) {
  return wrap(res, () => db.load(req.params.id))
  .then((todo) => {
    if (!todo) {
      res.sendStatus(404);
      throw new Error("Not found");
    }

    let title = req.body.title;
    if (title) {
      todo.title = title;
    }

    let completed = req.body.completed;
    if (completed !== undefined) {
      todo.completed = completed;
    }

    let order = req.body.order;
    if (order) {
      todo.order = order;
    }

    return db.save(todo);
  })
  .then(todo => res.json(formatTodo(todo)));
}


module.exports = updateTodo;
