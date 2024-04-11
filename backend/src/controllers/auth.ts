import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import User from '../models/User';

export const validateLogin = [
	body('username').notEmpty().withMessage('Username is required.'),
	body('password').notEmpty().withMessage('Password is required.'),
];

export const validateRegister = [
	body('username')
		.isLength({ min: 5 })
		.withMessage('Username must be at least 5 characters long.'),
	body('email')
		.isEmail()
		.withMessage('You must provide a valid email address.'),
	body('password')
		.isLength({ min: 12, max: 48 })
		.matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
		.withMessage(
			'Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
		),
	body('phone')
		.isMobilePhone('pl-PL')
		.withMessage('You must provide a valid phone number for Poland.'),
];

const handleValidationErrors = (
	req: Request,
	res: Response,
	next: Function
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

export const login = [
	validateLogin,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;

			const user = await User.findOne({ username });
			if (!user) {
				return res
					.status(401)
					.json({ message: 'Authentication failed. User not found.' });
			}

			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) {
				return res
					.status(401)
					.json({ message: 'Authentication failed. Incorrect password.' });
			}

			const token = jwt.sign(
				{ sub: user._id, username: user.username },
				process.env.JWT_SECRET!,
				{ expiresIn: '1h' }
			);

			res.json({ token, userId: user._id });
		} catch (error) {
			res.status(500).json({ message: 'Internal server error.' });
		}
	},
];

export const register = [
	validateRegister,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { username, email, password, phone } = req.body;

			const existingUser = await User.findOne({
				$or: [{ username }, { email }, { phone }],
			});
			if (existingUser) {
				return res.status(409).json({
					message:
						'User already exists with that username, email, or phone number.',
				});
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const user = new User({
				admin: false,
				username: req.body.username,
				email: req.body.email,
				password: hashedPassword,
				phone: req.body.phone,
			});

			await user.save();
			res.status(201).json({ message: 'User successfully registered.' });
		} catch (error) {
			res.status(500).json({ message: 'Internal server error.' });
		}
	},
];
