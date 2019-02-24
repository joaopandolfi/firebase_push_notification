const router = require('express').Router();
const pushController = require('../controller/push.js');

// Agenda Notificacao
router.put('/schedule', pushController.schedule);
router.get('/scheduled/:hash', pushController.scheduled);

// Envia Notificacao
router.put('/user', pushController.send);
router.put('/list', pushController.sendList);

// Busca notificacoes
router.get('/list', pushController.getLists);
// router.get("/list/all/", pushController.getAllLists);

// Busca por ID
router.get('/list/:idMessage', pushController.getPush);
router.get('/list/:idMessage/all', pushController.getAllList);

// Callback
router.get('/clicked', pushController.setClicked);

module.exports = router;
