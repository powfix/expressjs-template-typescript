import {Router} from 'express';
import db from '../../../../models/db-01';
import {Op, Sequelize} from "sequelize";

const router = Router();
router.post('/', (req, res) => {
  const {contact_number} = req.body;

  if (!contact_number || !contact_number.trim()) return res.sendStatus(412);

  // 회사 연락처로 검색
  const tasks = [
    db.User.findAll({
      attributes: {exclude: ['password']},
      include: [
        {
          model: db.Company, as: 'company', required: true,
          attributes: [],
          where: {
            contact_number,
          },
        }
      ],
      where: {
        deleted_at: { [Op.eq]: null },
      },
      order: [[Sequelize.col('id'), 'DESC']],
    }),
    db.User.findAll({
      attributes: {exclude: ['password']},
      include: [
        {
          model: db.Company, as: 'company', required: true,
          attributes: [],
          include: [
            {
              model: db.CompanyManager, as: 'manager', required: true,
              attributes: [],
              where: {
                contact_number,
              },
            }
          ],
        }
      ],
      where: {
        deleted_at: { [Op.eq]: null },
      },
      order: [[Sequelize.col('id'), 'DESC']],
    }),
  ];

  const uniqueByKeepLast = (data, key) => [
    ...new Map(
      data.map(x => [key(x), x])
    ).values(),
  ];

  Promise.all(tasks).then((results) => {
    const users = [];
    results.forEach((result) => users.push(...result));
    res.json({users: uniqueByKeepLast(users, it => it.uuid)});
  });
});

module.exports = router;
