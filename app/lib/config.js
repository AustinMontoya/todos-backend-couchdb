var couchUrl = process.env.TODOS_COUCH_URL || 'http://todoService:password@localhost:5984';
var appPort = process.env.TODOS_APP_PORT || 3000;
var serviceUrlBase = process.env.TODOS_URL_BASE || `http://localhost:${appPort}`;
var playerServiceUrl = process.env.TODOS_PLAYER_SERVICE_URL || 'http://localhost:4000';

module.exports = {
  couchUrl,
  appPort,
  serviceUrlBase
}
