"use strict";

const Promise = require('bluebird').Promise;
const wrap = require('../utils').wrap;
const db = require('../db');

function clearTodos(req, res) {
  var deletions = wrap(res, db.getAll)
                 .then((items) => items.map((item) => db.delete(item)));

  return wrap(res, () => Promise.all(deletions))
  .then(() => res.sendStatus(200));
}

module.exports = clearTodos;
