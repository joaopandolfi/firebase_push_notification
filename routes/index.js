const router = require('express').Router();
// Controllers
const pushRouter = require('./push.js');
const analyticRouter = require('./analytic.js');

// Delegating routes
router.use('/push', pushRouter);
router.use('/analytic', analyticRouter);

router.get('/', (req, res) => { res.send('OK'); });

module.exports = router;
