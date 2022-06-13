import express from 'express';

const router = express.Router();
router.all('/', (req, res) => {
  res.send('/v2');
});

module.exports = router;
