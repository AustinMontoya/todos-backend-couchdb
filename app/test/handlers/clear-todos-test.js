"use strict";

const sinon = require('sinon');
const clearTodos = require('../../lib/handlers/clear-todos');

describe('Clearing all todos', () => {
  var fakeDb;

  beforeEach(() => fakeDb = {
    getAll: sinon.stub().returns(Promise.resolve([{id: '123'}, {id: '456'}])),
    delete: sinon.stub().returns(Promise.resolve(null))
  });

  it('removes all existing todos', (done) => {
    const res = { sendStatus: sinon.spy() };
    clearTodos(fakeDb, null, res)
    .then(() => {
      res.sendStatus.calledWith(200).should.be.true;
      fakeDb.delete.callCount.should.equal(2);
      done();
    }).catch(done);
  });
});
