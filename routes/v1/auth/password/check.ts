import {Router} from 'express';
import bcrypt from 'bcryptjs';

const router = Router();
router.post('/', (req, res) => {
	const password = req.body.password;
	if (!password) return res.sendStatus(412);

	// @ts-ignore
	req.fetchReqUser({
		attributes: ['password'],
	}).then((user: any) => {
		if (!user) return res.sendStatus(404);

		bcrypt.compare(password, user.password).then((isEqual) => {
			if (!isEqual) return res.sendStatus(401);
			res.status(200).json({code: 'PASSWORD_MATCH'});
		});
	}).catch((e: Error) => {
		console.error(e);
		res.sendStatus(500);
	});
});

module.exports = router;
