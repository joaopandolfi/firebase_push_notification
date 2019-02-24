const PushService = require('../service/push.js');
const DaoPush = require('../model/dao/daoPush.js');
const DaoMessage = require('../model/dao/daoMessage.js');

// ------ LOCAL "METHODS" ------
const checkAllParametersList = body => (
  !body.pushIds || !body.title || !body.text || !body.senderId || !body.tag
);

const checkAllParametersSingle = body => (
  !body.pushId || !body.title || !body.text || !body.senderId || !body.tag
);

/*
* Convert pushId String to Array
* @param pushIds {String: "<pid1>,<pid2>"}
* @returns Array {Array:[<pid1>,<pid2>...]}
*/
const pushIdsToArray = (pushIds) => {
  // pushIds = pushIds.replace(/[.,]/g, ';');
  pushIds.replace(/[.,]/g, ';');
  return pushIds.split(';');
};

/*
* Seta mensagem como clicada
*/
module.exports.setClicked = (req, res) => {
  const push = {
    time: req.body.time,
    pushId: req.body.pushId,
    messageId: req.body.messageId,
  };

  // TODO: Verificar se os parametros são validos
  DaoPush.setClicked(push)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch(error => res.status(404).send(error));
};

/*
* Envia as notificações agendadas
*/
module.exports.scheduled = (req, res) => {
  DaoMessage.getScheduledPushs()
    .then((result) => {
      if (!result.data.length) return res.status(201).send(result);

      return result.data.map((push) => {
        const vPush = push;
        vPush.pushid_list = pushIdsToArray(push.pushid_list);
        return PushService.sendScheduledList(vPush)
          .then((push1) => {
            console.log('[Debug]-[Push:Controller:Scheduled] - Enviou os push agendados');
            return res.status(201).send({ success: true, data: push1[0] });
          })
          .catch(error => res.status(404).send(error));
      });
    });
};

/*
* Agenda notificacao
*/
module.exports.schedule = (req, res) => {
  res.setHeader('content-type', 'application/json');

  if (checkAllParametersList(req.body) || !req.body.date) {
    res.status(412).send({ success: false, message: 'pushid, title and text are required.' });
  } else {
    PushService
      .schedulePushList(req.body.senderId, req.body.pushIds, req.body.tag, req.body.date, req.body.title, req.body.text)
      .then((push) => {
        console.log(`[Debug]-[Push:Controller:Schedule] - Agendou push para ${date} `);
        res.status(201).send({ success: true, data: push[0] });
      })
      .catch(error => res.status(404).send(error));
  }
};

/*
* Envia em tempo real a notificacao
*/
module.exports.send = (req, res) => {
  res.setHeader('content-type', 'application/json');

  if (checkAllParametersSingle(req.body)) {
    res.status(412).send({ success: false, message: 'pushid, title and text are required.' });
  } else {
    PushService
      .sendPushToUser(req.body.senderId, req.body.pushId, req.body.tag, req.body.title, req.body.text)
      .then((push) => {
        console.log(`[Debug]-[Push:Controller] - Terminou de enviar push para ${req.body.pushId} `);
        res.status(201).send({ success: true, data: push[0] });
      })
      .catch(error => res.status(404).send(error));
  }
};

/*
* Envia notificações para uma lista de usuários (pushIds)
*/
module.exports.sendList = (req, res) => {
  // Debug
  console.log(`[Debug]-[Mensagem] title [${req.body.title}] text [${req.body.text}] list [${req.body.pushIds}]`);

  res.setHeader('content-type', 'application/json');

  if (checkAllParametersList(req.body)) {
    res.status(412).send({ success: false, message: 'title and text are required.' });
  } else {
    const arrayPushIds = pushIdsToArray(req.body.pushIds);
    PushService
      .sendPushToList(req.body.senderId, arrayPushIds, req.body.tag, req.body.title, req.body.text)
      .then(() => {
        console.log('[Debug]-[Controller:Push:sendList] - Terminou de enviar');
        // res.status(201).send({success: true, data: push})
      })
      .catch(error => res.status(404).send(error));

    // Para evitar tempo demasiado de espera
    res.status(201).send({ success: true, data: req.body.pushIds });
  }
};

/*
* Retorna uma lista de mensagens enviadas
*/
module.exports.getLists = (req, res) => {
  DaoMessage.getPushs().then((result) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send(result);
  })
    .catch((result) => {
      res.status(404).send(result);
    });
};

/*
* Recupera dados do Push
*/
module.exports.getPush = (req, res) => {
  DaoMessage.getPush(req.params.idMessage).then((result) => {
    res.setHeader('content-type', 'application/json');
    res.status(200).send(result);
  })
    .catch((result) => {
      res.status(404).send(result);
    });
};

/*
* Retorna uma lista de mensagens enviadas com seus respectivos clients separados por estado
*/
module.exports.getAllList = (req, res) => {
  DaoMessage.getFullPush(req.params.idMessage)
    .then((result) => {
      res.setHeader('content-type', 'application/json');
      res.status(200).send(result);
    })
    .catch((result) => {
      res.status(404).send(result);
    });
};
