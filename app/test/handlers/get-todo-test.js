"use strict";

const sinon = require('sinon');
const getTodo = require('../../lib/handlers/get-todo');

describe('Getting a todo', () => {
  var fakeDb = {};

  it('Fetches the todo', (done) => {
    const existingTodo = {
      id: 'abc',
      title: 'something',
      completed: true,
      order: 2
    };

    fakeDb.load = sinon.stub().returns(Promise.resolve(existingTodo));

    const req = { params: { id: 'abc' } };
    const res = { json: sinon.spy() };
    getTodo(fakeDb, req, res)
    .then(() => {
      res.json.args[0][0].should.deep.equal({
        title: 'something',
        completed: true,
        order: 2,
        url: 'http://localhost:3000/abc'
      })
      done();
    }).catch(done);
  });

  it('Does not fetch the todo when not found', (done) => {
    fakeDb.load = sinon.stub().returns(Promise.resolve(null));

    const req = { params: { id: 'abc' } };
    const res = { sendStatus: sinon.spy() };
    getTodo(fakeDb, req, res)
    .then(() => {
      res.sendStatus.calledWith(404).should.be.true
      done();
    }).catch(done);
  });
});
