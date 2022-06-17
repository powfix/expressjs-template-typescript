import {Request, Response, Router} from 'express';
import slowDown from 'express-slow-down';
import requestIP from 'request-ip';
import bcrypt from 'bcryptjs';
import jwt, {SignOptions} from "jsonwebtoken";
import crypto from "crypto";
import {UserToken} from "../../../models/db-01/UserToken";
import {SignInHistory} from "../../../models/db-01/SignInHistory";
import {User} from "../../../models/db-01/User";
import {STATUS} from "../../../constants/sign-in-history";

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

	const ip = requestIP.getClientIp(req);
	const ipv4 = ip?.toString()?.replace('::ffff:', '');
	const ipv6 = ip;
	const useragent = req.headers['user-agent'];

	// Create Login history
	SignInHistory.create({
		username,
		ipv4,
		ipv6,
		useragent,
	}).then((signInHistory) => {
		// Fetch user by username
		User.findOne({ where: { username } }).then((user) => {
			if (!user) {
				console.log(`User is not exists having '${username}' username`);
				res.sendStatus(401);
				signInHistory.status = STATUS.FAILED;
				signInHistory.save().finally(() => {});
				return;
			}

			if (user.deleted_at) {
				console.log('Deleted user', user.username);
				res.sendStatus(401);
				signInHistory.status = STATUS.FAILED;
				signInHistory.save().finally(() => {});
				return;
			}

			signInHistory.status = STATUS.PROCESSING;
			signInHistory.save().then(() => {
				// Password check
				bcrypt.compare(password, user.password).then((isEqual) => {
					if (!isEqual) {
						console.log('Incorrect password');
						res.sendStatus(401);
						signInHistory.status = STATUS.FAILED;
						signInHistory.save().finally(() => {});
						return;
					}

					// Password is Correct
					console.log('Password is correct');
					const jwt_options: SignOptions = {algorithm: "HS512", expiresIn: "180d", notBefore: "-1m"};
					const jwt_secret_key = require('../../../env/jwt-secret-key');
					const token = jwt.sign({...user.toJWTPayload()}, jwt_secret_key, jwt_options);
					const token_hash = crypto.createHash('sha512').update(token).digest('hex');
					const decoded = jwt.decode(token);

					UserToken.create({
						user_uuid: user.uuid,
						// @ts-ignore
						expired_at: decoded.exp,
						token,
						hash: token_hash,
					}).then((userToken: UserToken) => {
						res.status(200).json({code: 'success', token});
						signInHistory.status = STATUS.SUCCESS;
						signInHistory.save().finally(() => {});
					});
				});
			});
		});
	}).catch((e: Error) => {
		console.error(e);
		return res.sendStatus(500);
	});
});

module.exports = router;
