"use strict";

const sinon = require('sinon');
const createTodo = require('../../lib/handlers/create-todo');

describe('Creating a todo', () => {
  var fakeDb;
  var res;

  beforeEach(() => {
    fakeDb = {
      save: (params) => Promise.resolve(
        Object.assign({ id: '123'}, params)
      )
    };

    res = { json: sinon.spy() };
  });

  it('Creates a new todo with defaults', (done) => {
    const req = { body: {
      title: 'Finish writing tests'
    }};

    createTodo(fakeDb, req, res).then(() => {
      res.json.args[0][0].should.deep.equal({
        title: 'Finish writing tests',
        completed: false,
        order: 0,
        url: 'http://localhost:3000/123'
      });

      done();
    }).catch(done);
  });

  it('Allows order to be overridden', (done) => {
    const req = { body: {
      title: 'Finish writing tests',
      order: 5
    }};

    createTodo(fakeDb, req, res).then(() => {
      res.json.calledWithMatch({ order: 5 }).should.be.true;
      done();
    }).catch(done);
  });

  it('Does not let invalid properties through', (done) => {
    const req = { body: {
        title: 'Finish writing tests',
        id: '888',
        completed: true,
        url: 'http://example.com',
        somethingElse: 'meh'
    }};

    createTodo(fakeDb, req, res).then(() => {
      res.json.args[0][0].should.deep.equal({
        title: 'Finish writing tests',
        completed: false,
        order: 0,
        url: 'http://localhost:3000/123'
      });

      done();
    }).catch(done);
  });
});
