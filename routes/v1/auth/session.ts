import {Request, Response, Router} from 'express';
import crypto from "crypto";
import {UuidUtils} from "../../../utils/UuidUtils";
import {UserToken} from "../../../models/db-01/UserToken";

const router = Router();
router.get('/', (req: Request, res: Response) => {
	// @ts-ignore
	if (!req.authorization) return res.sendStatus(500);
	res.sendStatus(200);
});

router.delete('/', (req, res) => {
	// @ts-ignore
	const token_hash = crypto.createHash('sha512').update(req.authorization).digest('hex');
	// @ts-ignore
	const user_uuid = UuidUtils.toBuffer(req.reqUser.uuid);

	UserToken.findOne({ where: { user_uuid, hash: token_hash } }).then((userToken) => {
		if (!userToken) return res.status(200).json({code: 'success', message: 'Token not exists'});

		return userToken.destroy().then(() => {
			return res.status(200).json({code: 'success'});
		}).catch((e) => {
			console.error(e);
			return res.sendStatus(500);
		});
	});
});

module.exports = router;
