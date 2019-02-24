/*
* Dao Messages
*/
const dao = require('../dao.js');

const daoMessage = Object.create(dao);

// ------- INSERT -------
/*
* Salva pedido de push
* @param push [<senderId>, <title>, <text>, <filter>]
*/
daoMessage.save = push => new Promise((resolve, reject) => {
  const sql = 'INSERT INTO push_message (id_sender, title, text, filter, tag, pushid_list, timestamp) VALUES (?,?,?,?,?,?,?);';
  const data = [push.senderId, push.title, push.text, push.filter, push.tag,
    push.pushlist, push.timestamp];
  daoMessage.sql_query(sql, data)
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

// ------- SELECT -------
/*
* Recupera a lista de mensagens enviadas
*/
daoMessage.getPushs = () => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM push_message ;';
  daoMessage.sql_query(sql, [])
    .then((results) => {
      console.log('[Mysql] - Listando mensagens');
      resolve(results);
    })
    .catch((r) => {
      console.log('[MySQL]-[Error] - Erro na listagem das mensagens');
      reject(r);
    });
});

/*
* Recupera uma mensagem pelo ID
*/
daoMessage.getPush = idPush => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM push_message WHERE idpush_message = ?;';
  daoMessage.sql_query(sql, [idPush]).then((results) => {
    console.log(`[Mysql] - Buscando mensagem ${idPush}`);
    resolve(results);
  })
    .catch((r) => {
      console.log(`[MySQL]-[Error] - Erro na busca da mensagem ${idPush}`);
      reject(r);
    });
});

/*
* Recupera uma mensagem pelo ID junto com os dados dos usuários categorizados
*/
daoMessage.getFullPush = idPush => new Promise((resolve, reject) => {
  // Busca enviados
  const result = { success: true, data: { opened: [] } };
  let sql = 'SELECT * FROM user_push_message WHERE idpush_message = ? AND sended_timestamp IS NOT NULL;';
  daoMessage.sql_query(sql, [idPush])
    .then((results) => {
      result.data.sended = results.data;
      // Busca mensagens nao enviadas
      sql = 'SELECT * FROM user_push_message WHERE idpush_message = ? AND sended_timestamp IS NULL;';
      daoMessage.sql_query(sql, [idPush])
        .then((result1) => {
          console.log(`[Mysql] - Listando devices do id ${idPush}`);
          result.data.notSended = results.data;
          resolve(result1);
        })
        .catch((r) => {
          console.log('[MySQL]-[Error] - Erro na listagem das mensagens NAO ENVIADAS');
          reject(r);
        });
    })
    .catch((r) => {
      console.log('[MySQL]-[Error] - Erro na listagem das mensagens ENVIADAS');
      reject(r);
    });
});

/*
* Recupera a lista de mensagens enviadas junto com os dados dos usuários categorizados
* @deactivated
*/
daoMessage.getFullPushs = () => new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM push_message as pm INNER JOIN user_push_message as ump ON pm.idpush_message = ump.idpush_message ;';
  daoMessage.sql_query(sql, []).then((results) => {
    console.log('[Mysql] - Listando mensagens');
    resolve(results);
  })
    .catch((r) => {
      console.log('[MySQL]-[Error] - Erro na listagem das mensagens');
      reject(r);
    });
});

/*
* Recupera as mensagens programadas
*/
daoMessage.getScheduledPushs = () => new Promise((resolve, reject) => {
  const sql = "SELECT * FROM push_message WHERE filter = 'scheduled' AND timestamp <= NOW();";
  daoMessage.sql_query(sql, [])
    .then((results) => {
      console.log('[Mysql] - Buscando mensagens agendadas');
      resolve(results);
    })
    .catch((r) => {
      console.log('[MySQL]-[Error] - Erro na busca das mensagens agendadas');
      reject(r);
    });
});

// ----------- UPDATE ------------
/*
* Atualiza o status da mensagem
*/
daoMessage.updateMessageStatus = (messageId, status) => new Promise((resolve, reject) => {
  const sql = 'UPDATE push_message SET filter = ? WHERE idpush_message = ?;';
  daoMessage.sql_query(sql, [status, messageId])
    .then((results) => {
      console.log(`[Mysql] - Atualizando status da mensagem ${messageId} para ${status}`);
      resolve(results);
    })
    .catch((r) => {
      console.log(`[MySQL]-[Error] - Erro no update do status da mensagem ${messageId}`);
      reject(r);
    });
});

module.exports = daoMessage;
