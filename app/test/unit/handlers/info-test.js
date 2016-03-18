"use strict";

const sinon = require('sinon');
const deleteTodo = require('../../../lib/handlers/info');

describe('Fetching server info', () => {
  it('Provides the artifactId from the config', () => {
    const res = { json: sinon.spy() };
    deleteTodo(res, { artifactId: 'abcd' });
    res.json.args[0][0].should.deep.equal({ version: 'abcd' });
  });
});
