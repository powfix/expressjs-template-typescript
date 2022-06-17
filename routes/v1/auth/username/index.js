import {Router} from 'express';
import {authorization} from "../../../../middlewares/authorization";

const router = Router();
router.use('/find', require('./find'));

router.use(authorization({}));

module.exports = router;