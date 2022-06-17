import express from 'express';

const router = express.Router();
router.use('/health-check', require('./health-check'));
router.use('/v1', require('./v1'));

module.exports = router;
