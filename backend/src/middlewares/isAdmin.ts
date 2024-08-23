import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export const isAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById((req.user as any)._id);

		if (user && user.admin) {
			next();
		} else {
			res.status(403).json({ message: 'Access denied. Admins only.' });
		}
	} catch (error) {
		console.error('Error checking admin status:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
