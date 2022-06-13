import express from 'express';

const router = express.Router();
router.all('/', (req, res) => {
  res.send('/v1');
});

router.use('/user', require('./user'));

module.exports = router;
