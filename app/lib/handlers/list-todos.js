"use strict";

const utils = require('../utils');
const db = require('../db');

const formatTodo = utils.formatTodo;
const wrap = utils.wrap;

const listTodos = (req, res) =>
  wrap(res, () => db.getAll())
  .then((items) => res.json(items.map(formatTodo)));

module.exports = listTodos;
