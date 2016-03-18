"use strict";

const config = require('../../lib/config');

const nano = require('nano')(config.couchUrl);
const request = require('supertest');
const Promise = require('bluebird').Promise;
const createApp = require('../../lib/app-factory');
const Database = require('../../lib/database');

const listDatabases = Promise.promisify(nano.db.list);
const deleteDatabase = Promise.promisify(nano.db.destroy);
const createDatabase = Promise.promisify(nano.db.create);
const TEST_DB_NAME = 'todos__test';

const playerClientFixture = {
  todoCompleted: () => Promise.resolve()
}

var db, api;

function setupExistingTodos(done) {
  const promise =
    db
    .getAll()
    .then(todos => todos.map((todo) => db.delete(todo)))
    .then(() => Promise.all([
      db.save({title: 'test1', playerId: '123'}),
      db.save({title: 'test2', playerId: '456'})]))

  return done
    ? promise.then(() => done()).catch(done)
    : promise;
}

before(done => {
  listDatabases()
  .then(databases =>
    databases.some(name => name === TEST_DB_NAME)
      ? deleteDatabase(TEST_DB_NAME)
      : Promise.resolve())
  .then(() => createDatabase(TEST_DB_NAME))
  .then(() => {
    db = new Database(config.couchUrl, TEST_DB_NAME);
    const app = createApp(db, playerClientFixture);
    api = request(app);
    done();
  })
  .catch(done);
})

describe('Todos Service API', () => {
  describe('GET /todos', () => {
    before(setupExistingTodos);

    it('returns all todos', done => {
      api
      .get('/todos')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => res.body.length.should.equal(2))
      .end(done);
    });
  });

  describe('DELETE /todos', function () {
    it('deletes all todos', done => {
      api
      .delete('/todos')
      .expect(200)
      .end(() => Database.prototype.getAll.call(db)
                  .should.eventually.deep.equal([])
                  .notify(done))
    });
  });

  describe('GET /todos/:id', () => {
    var todoId;

    before(function(done) {
      setupExistingTodos()
      .then(() => db.getAll())
      .then(todos => {
        todoId = todos[0]._id;
        done();
      })
      .catch(done);
    })

    it('returns a todo', (done) => {
      api
      .get('/todos/' + todoId)
      .expect(200)
      .end((err, res) => {
        err && done(err);
        res.body.should.not.equal(null);
        res.body.url.should.contain(todoId);
        done();
      });
    });
  });

  describe('POST /todos', () => {
    it('creates a todo', (done) => {
      api
      .post('/todos')
      .send({ title: 'unicorn', playerId: 'abc'})
      .expect(200)
      .end((err, res) => {
        err && done(err);
        db.load(res.body.id)
          .should.eventually.not.equal(null)
          .notify(done);
      })
    });
  });

  describe('PATCH /todos', function () {
    var todoId;

    before(function(done) {
      setupExistingTodos()
      .then(() => db.getAll())
      .then(todos => {
        todoId = todos[0]._id;
        done();
      })
      .catch(done);
    })

    it('updates a todo', (done) => {
      api
      .patch('/todos/' + todoId)
      .send({title: 'foo'})
      .expect(200)
      .end(() =>
        db.load(todoId)
          .should.eventually
          .satisfy((result) => result.title === 'foo')
          .notify(done)
      );
    });
  });

  describe('DELETE /todos/:id', function () {
    var todoId;

    before(function(done) {
      setupExistingTodos()
      .then(() => db.getAll())
      .then(todos => {
        todoId = todos[0]._id;
        done();
      })
      .catch(done);
    })

    it('deletes a todo', done => {
      api
      .delete('/todos/' + todoId)
      .expect(200)
      .end(() => Database.prototype.load.call(db, todoId)
                  .should.eventually.equal(null)
                  .notify(done));
    });
  });
});
