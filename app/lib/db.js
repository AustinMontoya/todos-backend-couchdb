var Promise = require('bluebird').Promise;

var config = require('./config');

var nano = require('nano')(config.couchUrl);
var todos = nano.use('todos');
var shortid = require('shortid');

var getTodo = Promise.promisify(todos.get);
var insertTodo = Promise.promisify(todos.insert);
var destroyTodo = Promise.promisify(todos.destroy);
var listTodos = Promise.promisify(todos.list);

function load(id) {
  return getTodo(id, { revs_info: false })
    .catch((err, body) => {
      if (err.message === "not_found") {
        return null;
      }

      throw err;
    });
}

function save(todo) {
  if (!todo.id) {
    todo._id = todo.id = shortid.generate();
  }

  return insertTodo(todo).then(() => todo);
}

function remove(todo) {
  return destroyTodo(todo.id, todo._rev);
}

function getAll() {
  return listTodos()
  .then((response) => response.rows || [])
  .then((items) => Promise.all(items.map(item => load(item.id))))
}

module.exports = {
  load: load,
  save: save,
  delete: remove,
  getAll: getAll
};
