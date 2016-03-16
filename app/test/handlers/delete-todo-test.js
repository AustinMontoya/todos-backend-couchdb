"use strict";

const sinon = require('sinon');
const deleteTodo = require('../../lib/handlers/delete-todo');

describe('Deleting a todo', () => {
  var fakeDb;

  beforeEach(() => fakeDb = {
    load: sinon.stub().returns(Promise.resolve({id: 'abc'})),
    delete: sinon.stub().returns(Promise.resolve(null))
  });

  it('Removes it from the database', (done) => {
    const req = { params: { id: 'abc' } };
    const res = { sendStatus: sinon.spy() };
    deleteTodo(fakeDb, req, res)
    .then(() => {
      res.sendStatus.calledWith(200).should.be.true;
      fakeDb.delete.calledWithMatch({id: 'abc'}).should.be.true;
      done();
    }).catch(done);
  });
});
