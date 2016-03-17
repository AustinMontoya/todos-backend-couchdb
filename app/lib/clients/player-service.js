"use strict";

const promisify = require('bluebird').Promise.promisify;

function connect(requester) {
  const post = promisify(requester.post);

  return {
    todoCompleted: (playerId, id) =>
      post(`/players/${playerId}/completed_todos`, {body: {id}})
  }
}

module.exports = { connect }
