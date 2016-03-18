"use strict";

const wrap = require('../utils').wrap;

const deleteTodo = (db, req, res) =>
  wrap(res, () => db.load(req.params.id))
  .then(todo => {
    if (todo === null) {
      return Promise.resolve(404);
    } else  {
      return db.delete(todo).then(() => 200)
    }
  })
  .then(status => res.sendStatus(status));

module.exports = deleteTodo;
