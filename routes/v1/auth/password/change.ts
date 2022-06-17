import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {PASSWORD_SALT_ROUNDS} from "../../../../constants/user";

const router = Router();
router.put('/', (req, res) => {
	const {password, new_password} = req.body;

	if (!password) return res.sendStatus(412);
	if (!new_password) return res.sendStatus(412);

	// @ts-ignore
	req.fetchReqUser().then((user: any) => {
		if (!user) return res.sendStatus(404);

		return bcrypt.compare(password, user.password).then((isEqual) => {
			if (!isEqual) return res.sendStatus(401);

			return bcrypt.hash(new_password, PASSWORD_SALT_ROUNDS).then((password_hash) => {
				user.password = password_hash;
				return user.save().then(() => {
					res.json({code: 'success'});

					// Notification
					const title = '비밀번호 변경됨';
					const message = '비밀번호가 변경되었습니다';

					// const notification = {category: CATEGORY_PASSWORD_CHANGED, title: message, user_uuid: user.uuid, data: null};
					// const push_notification = {title, body: message};
					// const push_data = {category: CATEGORY_PASSWORD_CHANGED};

					// In-app notification
					// db.Notification.create(notification).then(() => { console.log('In-app notification created') }).catch(e => console.error(e));

					// Push notification
					// FCMUtils.sendViaUserUUID([user.uuid], {notification: push_notification, data: push_data}).then(() => {});
				});
			});
		});
	}).catch((e: Error) => {
		console.error(e);
		res.sendStatus(500);
	});
});

module.exports = router;
