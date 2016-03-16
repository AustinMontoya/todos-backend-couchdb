"use strict";

const wrap = require('../utils').wrap;

const deleteTodo = (db, req, res) =>
  wrap(res, () => db.load(req.params.id))
  .then(todo => wrap(res, () => db.delete(todo)))
  .then(() => res.sendStatus(200));

module.exports = deleteTodo;
