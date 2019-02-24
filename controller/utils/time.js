const moment = require('moment');

const timeUtils = {};

/*
* Recupera timestamp atual
* @return MySQL current Timestamp
*/
timeUtils.getTimestamp = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

module.exports = timeUtils;
