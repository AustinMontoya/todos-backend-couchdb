"use strict";

const utils = require('../utils');
const formatTodo = utils.formatTodo;
const wrap = utils.wrap;

const getTodo = (db, req, res) =>
  wrap(res, () => db.load(req.params.id))
  .then(todo => {
    if (!todo) {
      return res.sendStatus(404);
    }

    res.json(formatTodo(todo));
  });

module.exports = getTodo;
