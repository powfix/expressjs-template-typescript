import express, {Request, Response} from 'express';

const router = express.Router();
router.all('/', (req: Request, res: Response) => {
  res.send('/v1');
});

router.use('/user', require('./user'));

module.exports = router;
