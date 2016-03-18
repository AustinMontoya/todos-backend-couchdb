"use strict";

const Promise = require('bluebird').Promise;
const wrap = require('../utils').wrap;

function clearTodos(db, _req, res) {
  var deletions = wrap(res, () => db.getAll())
                 .then((items) => items.map((item) => db.delete(item)));

  return wrap(res, () => Promise.all(deletions))
  .then(() => res.sendStatus(200));
}

module.exports = clearTodos;
