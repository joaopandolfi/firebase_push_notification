const config = require('../credentials/config');

const credentials = config.mysql;

module.exports = {
  url: `jdbc:mysql://${credentials.host}:${credentials.port}/${credentials.database}`,
  schemas: credentials.database,
  locations: 'filesystem:sql/migrations',
  user: credentials.user,
  password: credentials.password,
  sqlMigrationSuffix: '.sql',
};
