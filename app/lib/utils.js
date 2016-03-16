"use strict";

const url = require('url');
const config = require('./config');

function wrap(res, action) {
  return action().catch((err) => {
    console.error(err);
    res.sendStatus(500);
    res.end();
    throw err;
  });
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
