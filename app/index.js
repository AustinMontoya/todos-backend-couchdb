"use strict";

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var shortid = require('shortid');

app.use(cors());
app.use(bodyParser.json());

var db = {
  _objects: {},
  load: function(id) {
    return this._objects[id];
  },
  save: function(object) {
    if (!object.id) {
      object.id = shortid.generate();
    }

    this._objects[object.id] = object;
  },
  delete: function(object) {
    if (!this._objects[object.id])
      throw new Error(`No todo found for ${object.id}`);

    delete this._objects[object.id];
  },
  getAll: function() {
    let objects = this._objects
    return Object.keys(objects).map((id) => Object.assign({id: id}, objects[id]))
  }
};

var apiRoot = '/';

function todoUrl(id) {
  return 'http://localhost:3000/' + id;
}

app.get('/:id', function(req, res) {
  var todo = db.load(req.params.id);
  if (!todo) {
    return res.sendStatus(404);
  }

  res.json(todo);
})

app.get(apiRoot, function (req, res) {
  res.json(db.getAll());
});

app.post(apiRoot, function(req, res) {
  let title = req.body.title;
  let order = req.body.order || 0;
  let todo = {
    title,
    order,
    completed: false
  };

  db.save(todo);
  res.json(Object.assign(todo, {
    url: todoUrl(todo.id)
  }));
});

app.patch(apiRoot + ':id', function(req, res) {
  var todo = db.load(req.params.id);
  if (!todo) {
    return res.sendStatus(404);
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

  db.save(todo);
  res.json(todo);
});

app.delete(apiRoot + ':id', function(req, res) {
  var todo = db.load(req.params.id);
  if (!todo) {
    return res.sendStatus(404);
  }

  db.delete(todo);
  res.sendStatus(200);
})

app.delete(apiRoot, function(req, res) {
  db.getAll().map((todo) => db.delete(todo));
  res.sendStatus(200);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
