import {Router} from 'express';
import {RandomUtils} from "../../../../utils/RandomUtils";
import bcrypt from "bcryptjs";
import {Op} from "sequelize";
import {PASSWORD_SALT_ROUNDS} from "../../../../constants/user";
import {User} from "../../../../models/db-01/User";

const router = Router();
router.post('/', (req, res) => {
  const {username, name, contact_number} = req.body;

  if (!username || !username.trim()) return res.sendStatus(412);
  if (!name || !name.trim()) return res.sendStatus(412);
  if (!contact_number || !contact_number.trim()) return res.sendStatus(412);

  User.findOne({
    where: {
      username,
      deleted_at: { [Op.eq]: null },
    },
  }).then((user) => {
    if (!user) {
      console.warn('User not found');
      return res.sendStatus(404);
    }

    const new_password = RandomUtils.randomLatinUppercaseStrings(6);
    bcrypt.hash(new_password, PASSWORD_SALT_ROUNDS).then((password_hash) => {
      user.password = password_hash;
      user.save().then(() => {
        res.json({code: 'success', new_password});

        // Notification
        const title = '비밀번호가 초기화되었습니다';
        const message = '비밀번호가 초기화되었습니다. 본인이 변경한게 맞는지 확인해주세요.';

        // const notification = {category: CATEGORY_PASSWORD_RESET, title: message, user_uuid: user.uuid, data: null};
        // const push_notification = {title, body: message};
        // const push_data = {category: CATEGORY_PASSWORD_RESET};

        // In-app notification
        // db.Notification.create(notification).then(() => { console.log('In-app notification created') }).catch(e => console.error(e));

        // Push notification
        // FCMUtils.sendViaUserUUID([user.uuid], {notification: push_notification, data: push_data}).then(() => {});
      });
    });
  }).catch(e => {
    console.error(e);
    res.sendStatus(500);
  });
});

module.exports = router;
