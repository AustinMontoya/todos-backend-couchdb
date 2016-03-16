"use strict";

const utils = require('../utils');
const formatTodo = utils.formatTodo;
const wrap = utils.wrap;

function createTodo(db, req, res) {
  let title = req.body.title;
  let order = req.body.order || 0;
  let todo = {
    title,
    order,
    completed: false
  };

  return wrap(res, () => db.save(todo))
        .then((todo) => res.json(formatTodo(todo)));
}

module.exports = createTodo;
