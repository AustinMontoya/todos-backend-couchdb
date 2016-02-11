var couchUrl = process.env.TODOS_COUCH_URL || 'http://todoService:password@localhost:5984';
var appPort = process.env.TODOS_APP_PORT || 3000;
var serviceUrlBase = process.env.TODOS_URL_BASE || `http://localhost:${appPort}`

module.exports = {
  couchUrl,
  appPort,
  serviceUrlBase
}
