/*
* Serviço de push notifications
* Integrado com FCM
* (C) João Carlos Pandolfi Santana - 19/06/2018
*/
const admin = require('firebase-admin');
const timeUtils = require('../controller/utils/time.js');
const DaoPush = require('../model/dao/daoPush.js');
const DaoMessage = require('../model/dao/daoMessage.js');
const ContNotification = require('../controller/notification.js');

const PushService = {};

// ------------- Private "Methods" ---------------
/*
* Envia push notification para um dispositivo
* @param userDevice ({userDeviceArr,userUUID}) {Token do FCM}
* @param messageId {Id da mensagem SQL}
* @param title {Titulo da mensagem}
* @param message {Texto da mensagem}
* @returns Promise
*/
const postUserDevice = (userDevice, messageId, title, message) => new Promise((resolve, reject) => {
  const payloadA = {
    notification: {
      title,
      body: message,
    },
    data: {
      title,
      body: message,
      messageID: messageId.toString(),
    },
    token: userDevice.userDeviceArr.fcmToken,
  };

  const payloadI = {
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body: message,
          },
          badge: !userDevice.userDeviceArr.badge ? 1 : userDevice.userDeviceArr.badge + 1,
        },
      },
    },
    data: {
      messageID: messageId.toString(),
    },
    token: userDevice.userDeviceArr.fcmToken,
  };

  const payload = userDevice.userDeviceArr.pushToken === '' ? payloadA : payloadI;
  if (userDevice.userDeviceArr.fcmToken) {
    console.log(`[Debug] - Tentando enviar msg para: ${userDevice.userUUID}`);

    admin.messaging().send(payload)
      .then((response) => {
        console.log(`[Firebase]-[Debug] - Mensagem para ${userDevice.userUUID} enviada com sucesso: ${response}`);
        resolve([messageId, userDevice.userUUID, userDevice.userDeviceArr.operationSystem,
          timeUtils.getTimestamp()]);
      })
      .catch((error) => {
        console.log(`[Firebase]-[Error] - Erro no envio da mensagem: ${error} para ${userDevice.userUUID}`);
        reject(new Error(`messageId: ${messageId},userUUID: ${userDevice.userUUID},operationSystem: ${userDevice.userDeviceArr.operationSystem}`));
        // reject([messageId, userDevice.userUUID, userDevice.userDeviceArr.operationSystem]);
      });
  } else {
    console.log(`[Firebase]-[Error] - PushId ${userDevice.userUUID} não tem dispositivo associado`);
    reject(new Error(`messageId: ${messageId},userUUID: ${userDevice.userUUID}`));
    // reject([messageId, userDevice.userUUID]);
  }
});

/*
* Envia push notification para um usuario - Salva envio no BD
* @param userUUID {Push Id do usuário}
* @param title {Titulo da mensagem}
* @param message {Texto da mensagem}
* @returns Promise
*/
const sendToUser = (messageId, userUUID, title, message) => new Promise((resolve, reject) => {
  if (!userUUID || !title || !message) {
    console.error('[REQ]-[Error] - All parameters are required');
    const res = {
      success: false,
      message: 'All parameters are required',
    };
    return reject(res);
  }

  const db = admin.database();
  const ref = db.ref(`/root/userDevice/${userUUID}`);
  return ref.once('value')
    .then((snapshot) => {
      const pushNotification = [];
      const savePushOnFirebase = [];
      savePushOnFirebase.push(ContNotification.save(userUUID, title, message));
      snapshot.forEach((childSnapshot) => {
        const userDeviceArr = childSnapshot.val();
        if (userDeviceArr.activeDevice && userDeviceArr.activeDevice === 'true') {
          pushNotification.push(postUserDevice({ userDeviceArr, userUUID },
            messageId, title, message));
          // savePushOnFirebase.push(ContNotification.save(userUUID,title,message));
        }
      });
      Promise.all(savePushOnFirebase); // Salva no Firebase
      return Promise.all(pushNotification);
    }).then((result) => {
      console.log('[Debug]- Fim do envio da lista de pushs');
      if (result.length) DaoPush.saveSuccess([result]);
      return resolve(result);
    })
    .catch((err) => {
      DaoPush.saveErros(err);
      console.error('[Firebase]-[Error] - Não conseguiu enviar as mensagens', err);
      reject(err);
    });
});

/*
* Envia push notification para uma lista de usuarios - Salva envio no BD
* @param pushIds {Lista de pushids}
* @param title {Titulo da mensagem}
* @param message {Texto da mensagem}
* @returns Promise
*/
const queueMessages = (senderId, pushIds, tag, title, text) => {
  const queue = [];

  // Salva mensagem no MySQL
  return DaoMessage.save({
    senderId, title, text, tag, pushlist: pushIds.toString(), filter: 'list', timestamp: timeUtils.getTimestamp(),
  })
    .then((messageId) => {
      pushIds.forEach((pushId) => {
        queue.push(sendToUser(messageId, pushId, title, text));
      });
      return Promise.all(queue);
    });
};

/*
* Agenda push notification para uma lista de usuarios - Salva envio no BD
* @param pushIds {Lista de pushids}
* @param title {Titulo da mensagem}
* @param text {Texto da mensagem}
* @returns Promise
*/
const scheduleMessages = (senderId, pushIds, tag, date, title, text) => DaoMessage.save({
  senderId, title, text, tag, timestamp: date, pushlist: pushIds, filter: 'scheduled',
});


/*
* Envia push notification AGENDADO para uma lista de usuarios - Atualiza estado do bd
* @param push {
    idpush_message: int,
    pushid_list: [<pushid>],
    title: String,
    text: String,
    }
* @returns Promise
*/
const scheduledMessages = (push) => {
  const queue = [];
  // Salva Atualiza estado da mensagem no Mysql no MySQL
  return DaoMessage.updateMessageStatus(push.idpush_message, 'scheduled-sended')
    .then(() => {
      push.pushid_list.forEach((pushId) => {
        queue.push(sendToUser(push.idpush_message, pushId, push.title, push.text));
      });
      return Promise.all(queue);
    });
};

// ------------- Public "Methods" ---------------
PushService.schedulePushList = (senderId, pushIds, tag, date, title, text) => new Promise(
  resolve => resolve(scheduleMessages(senderId, pushIds, tag, date, title, text))
);

PushService.sendScheduledList = push => new Promise(resolve => resolve(scheduledMessages(push)));

PushService.sendPushToList = (senderId, pushIds, tag, title, text) => new Promise(
  resolve => resolve(queueMessages(senderId, pushIds, tag, title, text))
);

PushService.sendPushToUser = (senderId, pushId, tag, title, text) => new Promise((resolve) => {
  DaoMessage.save({
    senderId, title, text, filter: 'none', pushlist: pushId, tag, timestamp: timeUtils.getTimestamp(),
  })
    .then(messageId => resolve(sendToUser(messageId, pushId, title, text)));
});

// Exporting
module.exports = PushService;
