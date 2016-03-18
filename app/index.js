const config = require('./lib/config');
const Database = require('./lib/database');
const playerService = require('./lib/clients/player-service');
const createApp = require('./lib/app-factory');

const playerClient = playerService.connect(config.playerServiceRequester);
const db = new Database(config.couchUrl, config.databaseName);

createApp(db, playerClient)
.listen(config.appPort, () => {
  console.log(`todos service listening on port ${config.appPort}`);
});
