"use strict";

const sinon = require('sinon');
const updateTodo = require('../../lib/handlers/update-todo');

describe('Updating a todo', () => {
  var fakeDb, res, fakeClient;

  beforeEach(() => {
    fakeDb = {
      save: (obj) => obj,
      load: () => Promise.resolve({
        id: 'abc',
        playerId: '123',
        title: 'test title',
        order: 3,
        completed: false
      })
    };

    sinon.stub(fakeDb, "save", (obj) => Promise.resolve(obj));

    fakeClient = { todoCompleted: () => {} };
    sinon.stub(fakeClient, "todoCompleted").returns(Promise.resolve())

    res = {
      json: sinon.spy(),
      sendStatus: sinon.spy()
    };
  });


  it('Updates a todo', (done) => {
    const req = {
      params: { id: 'abc' },
      body: {
        title: 'new title',
        completed: true,
        order: 1
      }
    };

    updateTodo(fakeDb, req, res, fakeClient).then(() => {
      const savedObject = fakeDb.save.args[0][0];

      savedObject.should.deep.equal({
        id: 'abc',
        playerId: '123',
        title: 'new title',
        completed: true,
        order: 1
      });

      res.json
        .calledWithMatch({ url: 'http://localhost:3000/abc' })
        .should.be.true;

      done();
    }).catch(done);
  });

  it('Does not unset properties if not present', (done) => {
    const req = {
      params: { id: 'abc' },
      body: {}
    };

    updateTodo(fakeDb, req, res, fakeClient).then(() => {
      const savedObject = fakeDb.save.args[0][0];
      savedObject.title.should.equal('test title');
      savedObject.order.should.equal(3);
      savedObject.completed.should.be.false;

      res.json
        .calledWithMatch({ url: 'http://localhost:3000/abc' })
        .should.be.true;

      done();
    }).catch(done);
  });

  it('Lets false through for completed (as opposed to undefined)', (done) => {
    fakeDb.save.restore();
    sinon.stub(fakeDb, "save", (obj) => Promise.resolve(obj));

    const req = {
      params: { id: 'abc' },
      body: { completed: false }
    };

    updateTodo(fakeDb, req, res, fakeClient).then(() => {
      const savedObject = fakeDb.save.args[0][0];
      savedObject.completed.should.be.false;

      res.json
        .calledWithMatch({ url: 'http://localhost:3000/abc' })
        .should.be.true;

      done();
    }).catch(done);
  });

  it('returns 404 if not found', (done) => {
    fakeDb.load = () => Promise.resolve(null);
    const req = { params: { id: 'def' } };

    updateTodo(fakeDb, req, res, fakeClient).then(() => {
      throw Error("Should not succeed");
    }).catch((err) => {
      res.sendStatus.calledWith(404).should.be.true;
      err.message.should.equal('Not found')
      done();
    });
  });

  it('Calls the player service if a todo is completed', (done) => {
    const req = {
      params: { id: 'abc' },
      body:  { completed: true }
    };

    updateTodo(fakeDb, req, res, fakeClient).then(() => {
      fakeClient
        .todoCompleted
        .calledWith('123', 'abc')
        .should.be.true;

      done();
    }).catch(done);
  });

  it('Does not call the player service if the todo was already completed',
    (done) => {
      fakeDb.load = () => Promise.resolve({
        id: 'abc',
        playerId: '123',
        title: 'test title',
        order: 3,
        completed: true
      });

      const req = {
        params: { id: 'abc' },
        body:  { completed: true }
      };

      updateTodo(fakeDb, req, res, fakeClient).then(() => {
        fakeClient
          .todoCompleted.called
          .should.be.false;

        done();
      }).catch(done);
  })
});
