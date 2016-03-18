"use strict";

const sinon = require('sinon');
const playerService = require('../../../lib/clients/player-service');

describe('PlayerService Client', function () {
  var client, postArgs;

  beforeEach(() => {
    let post = (url, data, fn) => {
      postArgs = [url, data];
      fn();
    }

    client = playerService.connect({
      post
    });
  });

  it('Calls todoCompleted correctly', (done) => {
    client.todoCompleted('123', 'abc').then(() => {
      postArgs.should.deep.equal([
        '/players/123/completed_todos',
        { body: {id: 'abc'} }
      ])

      done();
    }).catch(done);
  });
});
