"use strict";

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

const appPort = require('./lib/config').appPort;

const getTodo = require('./lib/handlers/get-todo');
const listTodos = require('./lib/handlers/list-todos');
const clearTodos = require('./lib/handlers/clear-todos');
const createTodo = require('./lib/handlers/create-todo');
const updateTodo = require('./lib/handlers/update-todo');
const deleteTodo = require('./lib/handlers/delete-todo');

app.use(cors());
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.sendStatus(404))

app.get('/:id', getTodo);
app.patch('/:id', updateTodo);
app.delete('/:id', deleteTodo)
app.get('/', listTodos);
app.post('/', createTodo);
app.delete('/', clearTodos);

app.listen(appPort, () =>
  console.log(`Todos backend listening on port ${appPort}`)
);
