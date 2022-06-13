import express, {Request, Response} from 'express';

const router = express.Router();
router.all('/', (req: Request, res: Response) => {
  res.send('/v2');
});

module.exports = router;
