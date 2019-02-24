/*
* Modelo base do Dao
*/
const Mysql = require('../database/mysql');

// Class
const dao = {};

dao.sql_query = (query, data) => new Promise((resolve, reject) => {
  let sql = '';
  try {
    sql = Mysql.format(query, data);
  } catch (e) {
    const result = dao.format_error(500, 'Database error');
    console.log(result);
    return reject(result);
  }

  return Mysql.query(sql)
    .then(results => resolve(dao.format_response(results)))
    .catch(() => reject(dao.format_error(500, 'Internal server error')));
});

dao.format_response = pData => ({
  success: true,
  data: pData,
});

dao.format_error = ((errorCode, pMessage) => ({
  success: false,
  error: errorCode,
  message: pMessage,
}));

module.exports = dao;
