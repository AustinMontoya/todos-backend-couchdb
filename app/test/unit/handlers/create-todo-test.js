"use strict";

const sinon = require('sinon');
const createTodo = require('../../../lib/handlers/create-todo');

describe('Creating a todo', () => {
  var fakeDb;
  var res;

  beforeEach(() => {
    fakeDb = {
      save: (params) => Promise.resolve(
        Object.assign({ id: '123'}, params)
      )
    };

    var statusStub = sinon.stub();
    statusStub.returnsThis();
    res = {
      status: statusStub,
      json: sinon.spy()
    };
  });

  it('Creates a new todo with defaults', (done) => {
    const req = { body: {
      title: 'Finish writing tests',
      playerId: '123'
    }};

    createTodo(fakeDb, req, res).then(() => {
      res.json.args[0][0].should.deep.equal({
        title: 'Finish writing tests',
        playerId: '123',
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
      playerId: '123',
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
        playerId: '123',
        id: '888',
        completed: true,
        url: 'http://example.com',
        somethingElse: 'meh'
    }};

    createTodo(fakeDb, req, res).then(() => {
      res.json.args[0][0].should.deep.equal({
        title: 'Finish writing tests',
        playerId: '123',
        completed: false,
        order: 0,
        url: 'http://localhost:3000/123'
      });

      done();
    }).catch(done);
  });

  it('Requires a title and playerId', (done) => {
    const req = { body: {} };

    createTodo(fakeDb, req, res).then((done) => {
      done(new Error('Validation did not fail'));
    }).catch((err) => {
      err.message.should.equal('Validation failed!');
      res.status.calledWith(400).should.be.true;
      res.json.args[0][0].should.deep.equal({
        errors: [
          'title is required',
          'playerId is required'
        ]
      });
      done();
    }).catch(done);
  });
});
