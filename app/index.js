"use strict";

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

const appPort = require('./config').appPort;

const getTodo = require('./handlers/get-todo');
const listTodos = require('./handlers/list-todos');
const clearTodos = require('./handlers/clear-todos');
const createTodo = require('./handlers/create-todo');
const updateTodo = require('./handlers/update-todo');
const deleteTodo = require('./handlers/delete-todo');

app.use(cors());
app.use(bodyParser.json());

var apiRoot = '/';

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
