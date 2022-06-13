import express from 'express';

const router = express.Router();
router.all('/', (req, res) => {
  res.send('/v1');
});

router.use('/v1', require('./v1'));
router.use('/v2', require('./v2'));

module.exports = router;
