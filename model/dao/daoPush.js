/*
* Dao Push Notification
*/
const dao = require('../dao.js');

const daoPush = Object.create(dao);

// ------- INSERT -------
/*
* Salva mensagens que foram enviadas ao usuário
* @param push [[<idpush_message>, <user_pushid>, <sended_timestamp>]]
*/
daoPush.saveSuccess = push => new Promise((resolve, reject) => {
  const sql = 'INSERT INTO user_push_message (idpush_message, user_pushid, so, sended_timestamp) VALUES ?;';
  daoPush.sql_query(sql, push)
    .then((results) => {
      const pushId = results.data.insertId;
      console.log(`[Mysql] - Inseriu a notificacao ${pushId}`);
      resolve(pushId);
    })
    .catch((r) => {
      console.log('[MySQL]-[Error] - Erro na insercao da notificao');
      reject(r);
    });
});

/*
* Salva mensagens que não foram enviadas ao usuário
* @param push [[<idpush_message>, <user_pushid>]]
*/
daoPush.saveError = push => new Promise((resolve, reject) => {
  const sql = 'INSERT INTO user_push_message (idpush_message, user_pushid, so) VALUES ?;';
  daoPush.sql_query(sql, push)
    .then((results) => {
      console.log(`[Mysql] - Salvou erro de envio ${results.data.insertId}`);
      resolve(results.data.insertId);
    })
    .catch((r) => {
      console.log('[MySQL]-[Error] - Erro no salvamento o push não entregue');
      reject(r);
    });
});

/*
* Salva mensagens que não foram enviadas ao usuário
* @param push {time,pushId, messageId}
*/
daoPush.setClicked = push => new Promise((resolve, reject) => {
  const sql = 'UPDATE user_push_message SET opened_timestamp = NOW() WHERE user_push_id = ? AND idpush_message = ?;';
  daoPush.sql_query(sql, [push.time, push.pushId, push.messageId])
    .then((results) => {
      console.log(`[Mysql] - Atualizando mensagem ${push.messageId} para clicada`);
      resolve(results);
    })
    .catch((r) => {
      console.log(`[MySQL]-[Error] - Erro no update da mensagem ${push.messageId} para clicada`);
      reject(r);
    });
});

module.exports = daoPush;
