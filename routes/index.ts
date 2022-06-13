import express, {Request, Response} from 'express';

const router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.send('/v1');
});

router.use('/v1', require('./v1'));
router.use('/v2', require('./v2'));

module.exports = router;
