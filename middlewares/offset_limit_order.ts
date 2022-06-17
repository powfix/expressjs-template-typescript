import {NextFunction} from 'express';

export const offset_limit_order = (req: any, res: any, next: NextFunction) => {
	const offset = req.query.hasOwnProperty('offset') ? parseInt(req.query.offset) : undefined;
	const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : undefined;

	const order_by = req.query['ob'];
	const order_direction = req.query['od'];

	if (offset !== undefined && isNaN(offset)) return res.sendStatus(400);
	if (limit !== undefined && isNaN(limit)) return res.sendStatus(400);

	if (order_by && !order_direction) return res.sendStatus(400);
	if (!order_by && order_direction) return res.sendStatus(400);

	if (!req.query_options) req.query_options = {};
	Object.assign(req.query_options, {offset, limit});

	if (!req.query_options.order || !Array.isArray(req.query_options.order)) req.query_options.order = [];
	if (order_by && order_direction) req.query_options.order.push([order_by, order_direction]);

	next();
};

export const hasNext = (req: any, results: any, body: any) => {
	if (req.query_options && req.query_options.limit !== undefined && req.query_options.limit !== 0) {
		const has_next = results.length >= req.query_options.limit;
		Object.assign(body, {has_next});
		return has_next;
	}
	return null;
};
