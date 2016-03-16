"use strict";

const utils = require('../utils');
const formatTodo = utils.formatTodo;
const wrap = utils.wrap;

function getErrors(params) {
  let errors = [];

  let title = params.title;
  if (!title) {
    errors.push('title is required');
  }

  let playerId = params.playerId;
  if (!playerId) {
    errors.push('playerId is required');
  }

  return errors;
}

function createTodo(db, req, res) {
  const errors = getErrors(req.body);

  if (errors.length) {
    res.status(400).json({errors});
    return Promise.reject(new Error('Validation failed!'))
  }

  let todo = {
    title: req.body.title,
    playerId: req.body.playerId,
    order: req.body.order || 0,
    completed: false
  };

  return wrap(res, () => db.save(todo))
        .then((todo) => res.json(formatTodo(todo)));
}

module.exports = createTodo;
