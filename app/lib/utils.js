"use strict";

const url = require('url');
const config = require('./config');

function handleFailure(err, res) {
  res.sendStatus(500);
  res.end();
  throw err;
}

function wrap(res, action) {
  var result;

  try {
    result = action();
    return result.catch((err) =>
      handleFailure(err, res)
    );
  } catch(err) {
    handleFailure(err, res);
  }
}

function formatTodo(todo) {
  return {
    title: todo.title,
    playerId: todo.playerId,
    completed: todo.completed,
    order: todo.order,
    url: url.resolve(config.serviceUrlBase, todo.id)
  }
}

module.exports = {
  wrap,
  formatTodo
};
