"use strict";

const Promise = require('bluebird').Promise;
const nano = require('nano');
const shortid = require('shortid');

module.exports = class Database {
  constructor(url, dbname) {
    const todos = nano(url).use(dbname);
    this._getTodo = Promise.promisify(todos.get);
    this._insertTodo = Promise.promisify(todos.insert);
    this._destroyTodo = Promise.promisify(todos.destroy);
    this._listTodos = Promise.promisify(todos.list);
  }

  load(id) {
    return this._getTodo(id, { revs_info: false })
      .catch((err, body) => {
        if (err.message === "not_found") {
          return null;
        }

        if (err.message === "deleted") {
          return null;
        }

        throw err;
      });
  }

  save(todo) {
    if (!todo.id) {
      todo._id = todo.id = shortid.generate();
    }

    return this._insertTodo(todo).then(() => todo);
  }

  delete(todo) {
    debugger;
    return this._destroyTodo(todo.id, todo._rev);
  }

  getAll() {
    return this._listTodos()
    .then((response) => response.rows || [])
    .then((items) => Promise.all(items.map(item => this.load(item.id))))
  }
}
