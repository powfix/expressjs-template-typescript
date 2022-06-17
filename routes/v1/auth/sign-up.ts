import {Request, Response, Router} from 'express';
import slowDown from 'express-slow-down';
import requestIP from 'request-ip';
import {sequelize} from "../../../models/db-01";
import jwt, {SignOptions} from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {User} from "../../../models/db-01/User";
import {UserToken} from "../../../models/db-01/UserToken";
import moment from "moment";
import {PASSWORD_SALT_ROUNDS, Type} from "../../../constants/user";

const router = Router();
router.use(slowDown({
	windowMs: 10 * 60 * 1000, // 15 minutes
	delayAfter: 10, // allow 100 requests per 15 minutes, then...
	delayMs: 500, // begin adding 500ms of delay per request above 100:
	maxDelayMs: 5000,
	skipSuccessfulRequests: true,
}));
router.post('/', (req: Request, res: Response) => {
	const {username, password} = req.body;
	if (!username) return res.sendStatus(412);
	if (!password) return res.sendStatus(412);

	if (!req.body.hasOwnProperty('company')) { console.warn('company is not exists'); return res.sendStatus(412); }
	if (typeof req.body.company !== 'object') { console.warn('company is not object'); return res.sendStatus(400); }

	if (!req.body.hasOwnProperty('manager')) { console.warn('manager is not exists'); return res.sendStatus(412); }
	if (typeof req.body.manager !== 'object') { console.warn('manager is not object'); return res.sendStatus(400); }

	const ip = requestIP.getClientIp(req);
	const useragent = req.headers['user-agent'];

	User.count({ where: { username } }).then((count) => {
		if (count > 0) {
			return res.status(400).json({code: 'DUP_USERNAME'});
		}

		sequelize.transaction().then((t) => {
			bcrypt.hash(password, PASSWORD_SALT_ROUNDS).then((password_hash) => {
				// User
				User.create({
					deleted_at: null,
					type: Type.NORMAL,
					username,
					password: password_hash,
				}, {transaction: t}).then((user) => {
					const {name, address, address_detail, contact_number, sales, employees, business_type_uuid} = req.body.company;
					const jwt_options: SignOptions = {algorithm: "HS512", expiresIn: "180d", notBefore: "-1m"};
					const jwt_secret_key = require('../../../env/jwt-secret-key');
					const token = jwt.sign({...user.toJWTPayload()}, jwt_secret_key, jwt_options);
					const token_hash = crypto.createHash('sha512').update(token).digest('hex');
					const decoded = jwt.decode(token);

					return UserToken.create({
						user_uuid: user.uuid,
						// @ts-ignore
						expired_at: moment.unix(decoded.exp),
						token_hash,
						token,
					}, {transaction: t}).then((userToken: any) => {
						console.info('Authorization token 발급완료', userToken?.token);
						return Promise.resolve(() => res.status(201).json({token}));
					});
				}).then((result) => {
					t.afterCommit((e): any => {
						if (typeof result === 'function') {
							return result();
						}
					});
					return t.commit();
				}).catch((e: any) => {
					console.error(e);
					res.sendStatus(500);
					return t.rollback();
				});
			});
		}).catch((e: any) => {
			console.error(e);
			return res.sendStatus(500);
		});
	});
});

module.exports = router;
