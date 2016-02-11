"use strict";

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./db');
var Promise = require('bluebird').Promise;
var config = require('./config');
var url = require('url');

app.use(cors());
app.use(bodyParser.json());

var apiRoot = '/';

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
    completed: todo.completed,
    order: todo.order,
    url: url.resolve(config.serviceUrlBase, todo.id)
  }
}

app.get('/:id', (req, res) => {
  wrap(res, () => db.load(req.params.id))
  .then(todo => {
    if (!todo) {
      return res.sendStatus(404);
    }

    res.json(formatTodo(todo));
  });
})

app.get(apiRoot, (req, res) => {
  wrap(res, () => db.getAll())
  .then((items) => res.json(items.map(formatTodo)));
});

app.post(apiRoot, (req, res) => {
  let title = req.body.title;
  let order = req.body.order || 0;
  let todo = {
    title,
    order,
    completed: false
  };

  wrap(res, () => db.save(todo))
  .then((todo) => {
    res.json(formatTodo(todo));
  })
});

app.patch(apiRoot + ':id', (req, res) => {
  wrap(res, () => db.load(req.params.id))
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
    if (completed) {
      todo.completed = completed;
    }

    let order = req.body.order;
    if (order) {
      todo.order = order;
    }

    return db.save(todo);
  })
  .then(todo => res.json(formatTodo(todo)));
});

app.delete(apiRoot + ':id', (req, res) => {
  wrap(res, () => db.load(req.params.id))
  .then(todo => wrap(res, () => db.delete(todo)))
  .then(() => res.sendStatus(200));
})

app.delete(apiRoot, (req, res) => {
  var deletions = wrap(res, db.getAll)
                 .then((items) => items.map((item) => db.delete(item)));

  wrap(res, () => Promise.all(deletions))
  .then(() => res.sendStatus(200));
});

app.listen(config.appPort, function () {
  console.log(`Todos backend listening on port ${config.appPort}`);
});
