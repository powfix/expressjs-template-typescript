import {Router} from 'express';
import {authorization} from "../../../middlewares/authorization";

const router = Router();
router.use('/sign-in', require('./sign-in'));
router.use('/sign-up', require('./sign-up'));
router.use('/password', require('./password'));

router.use(authorization({}));
router.use('/secession', require('./secession'));
router.use('/session', require('./session'));

module.exports = router;
