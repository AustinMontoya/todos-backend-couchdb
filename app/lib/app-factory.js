"use strict";

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const getTodo = require('./handlers/get-todo');
const listTodos = require('./handlers/list-todos');
const clearTodos = require('./handlers/clear-todos');
const createTodo = require('./handlers/create-todo');
const updateTodo = require('./handlers/update-todo');
const deleteTodo = require('./handlers/delete-todo');
const showInfo = require('./handlers/info');

module.exports = function createApp(db, playerClient) {
  const bindHandler = fn => (req, res) => fn(db, req, res);

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/favicon.ico', (req, res) => res.sendStatus(404))

  app.get('/info', (_req, res) => showInfo(res, config));
  app.get('/todos', bindHandler(listTodos));
  app.post('/todos', bindHandler(createTodo));
  app.delete('/todos', bindHandler(clearTodos));
  app.get('/todos/:id', bindHandler(getTodo));
  app.patch('/todos/:id', (req, res) => updateTodo(db, req, res, playerClient));
  app.delete('/todos/:id', bindHandler(deleteTodo));

  return app;
}
