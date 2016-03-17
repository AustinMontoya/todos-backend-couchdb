"use strict";

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

const config = require('./lib/config');
const db = require('./lib/db');
const playerService = require('./lib/clients/player-service');

const getTodo = require('./lib/handlers/get-todo');
const listTodos = require('./lib/handlers/list-todos');
const clearTodos = require('./lib/handlers/clear-todos');
const createTodo = require('./lib/handlers/create-todo');
const updateTodo = require('./lib/handlers/update-todo');
const deleteTodo = require('./lib/handlers/delete-todo');
const showInfo = require('./lib/handlers/info');

const appPort = config.appPort;
const playerClient = playerService.connect(config.playerServiceRequester)

const bindHandler = fn => (req, res) => fn(db, req, res);

app.use(cors());
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.sendStatus(404))

app.get('/info', (_req, res) => showInfo(res, config));
app.get('/:id', bindHandler(getTodo));
app.patch('/:id', (req, res) => updateTodo(db, req, res, playerClient));
app.delete('/:id', bindHandler(deleteTodo));
app.get('/', bindHandler(listTodos));
app.post('/', bindHandler(createTodo));
app.delete('/', bindHandler(clearTodos));

app.listen(appPort, () =>
  console.log(`Todos backend listening on port ${appPort}`)
);
