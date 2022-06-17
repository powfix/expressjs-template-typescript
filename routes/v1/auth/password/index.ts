import {Router} from 'express';
import {authorization} from "../../../../middlewares/authorization";

const router = Router();
router.use('/reset', require('./reset'));

router.use(authorization({}));
router.use('/check', require('./check'));
router.use('/', require('./change'));

module.exports = router;
