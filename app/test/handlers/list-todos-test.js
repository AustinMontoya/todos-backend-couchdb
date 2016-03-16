"use strict";

const sinon = require('sinon');
const listTodos = require('../../lib/handlers/list-todos');

describe('Listing all todos', () => {
  var fakeDb;
  const dbResults = [
    { id: '123', title: 'test1', completed: false, order: 0 },
    { id: '456', title: 'test2', completed: true, order: 1 }
  ]

  beforeEach(() => fakeDb = {
    getAll: sinon.stub().returns(Promise.resolve(dbResults))
  });

  it('Returns all existing todos', (done) => {
    const res = { json: sinon.spy() };
    listTodos(fakeDb, null, res)
    .then(() => {
      let response = res.json.args[0][0];
      response[0].should.deep.equal({
        title: 'test1',
        completed: false,
        order: 0,
        url: 'http://localhost:3000/123'
      });

      response[1].should.deep.equal({
        title: 'test2',
        completed: true,
        order: 1,
        url: 'http://localhost:3000/456'
      });
      done();
    }).catch(done);
  });
});
