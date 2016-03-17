"use strict";

const utils = require('../utils');
const formatTodo = utils.formatTodo;
const wrap = utils.wrap;

module.exports = function updateTodo(db, req, res, playerClient) {
  let wasAlreadyComplete = false;

  return wrap(res, () => db.load(req.params.id))
  .then(todo => {
    if (!todo) {
      res.sendStatus(404);
      throw new Error("Not found");
    }

    if (todo.completed) {
      wasAlreadyComplete = true;
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
  .then(todo => wrap(res, () =>
    !todo.completed || wasAlreadyComplete
      ? Promise.resolve(todo)
      : playerClient
        .todoCompleted(todo.playerId, todo.id)
        .then(() => todo)))
  .then(todo =>
    res.json(formatTodo(todo)));
}
