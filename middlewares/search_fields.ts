import {Op} from "sequelize";
import {Request, Response, NextFunction} from 'express';

export const search_fields = (fields: string[], like_condition: boolean) => (req: Request, res: Response, next: NextFunction) => {
	let query = (req.query.q || req.query.query || req.query.search);

	const where = {};
	if (query) {
		if (like_condition) query = `%${query}%`;
		// @ts-ignore
		req.q = query;
		// @ts-ignore
		where[Op.or] = fields.map((field: string) => ({ [field]: { [Op.like]: query } }));
	}

	// @ts-ignore
	if (!req.query_options) req.query_options = {};
	// @ts-ignore
	if (!req.query_options.where) req.query_options.where = {};
	// @ts-ignore
	Object.assign(req.query_options.where, where);

	next();
};
