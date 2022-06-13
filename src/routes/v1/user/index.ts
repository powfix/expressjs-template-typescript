import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
  const users = [
    {id: 1, name: 'John', age: 73},
    {id: 2, name: 'David', age: 45},
    {id: 3, name: 'Freddie', age: 49},
    {id: 4, name: 'Gil-dong', age: 27},
    {id: 5, name: 'Kim Min-soo', age: 33},
  ];
  res.json(users);
});

module.exports = router;
