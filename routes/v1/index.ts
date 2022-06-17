import {Router, Request, Response} from 'express';

const router = Router();
router.use('/auth', require('./auth'));

module.exports = router;
