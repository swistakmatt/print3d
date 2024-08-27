import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

export const validateUpdateUsername = [
	body('username')
		.isLength({ min: 5 })
		.withMessage('Username must be at least 5 characters long.'),
];

export const validateUpdateEmail = [
	body('email')
		.isEmail()
		.withMessage('You must provide a valid email address.'),
];

export const validateUpdatePassword = [
	body('password')
		.isLength({ min: 12 })
		.matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
		.withMessage(
			'Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
		),
];

export const validateUpdateName = [
	body('firstName')
		.isLength({ min: 2, max: 30 })
		.withMessage('First name must be between 2 and 30 characters long.'),
	body('lastName')
		.isLength({ min: 2, max: 30 })
		.withMessage('Last name must be between 2 and 30 characters long.'),
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

const updateUsername = [
	validateUpdateUsername,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { username, userId } = req.body;

			if (!userId) {
				return res.status(400).json({ message: 'Include valid UserID' });
			}

			const existingUser = await User.findOne({ username });
			if (existingUser && existingUser._id.toString() !== userId.toString()) {
				return res.status(409).json({ message: 'Username is already taken.' });
			}

			const user = await User.findByIdAndUpdate(
				userId,
				{ username },
				{ new: true }
			);
			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			res.json({ message: 'Username updated successfully.', user });
		} catch (error) {
			console.error('Error updating username:', error);
			res.status(500).json({ message: 'Internal Server Error.' });
		}
	},
];

const updateEmail = [
	validateUpdateEmail,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { email, userId } = req.body;

			if (!userId) {
				return res.status(400).json({ message: 'Include valid UserID' });
			}

			const existingUser = await User.findOne({ email });
			if (existingUser && existingUser._id.toString() !== userId.toString()) {
				return res.status(409).json({ message: 'Email is already in use.' });
			}

			const user = await User.findByIdAndUpdate(
				userId,
				{ email },
				{ new: true }
			);
			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			res.json({ message: 'Email updated successfully.', user });
		} catch (error) {
			console.error('Error updating email:', error);
			res.status(500).json({ message: 'Internal Server Error.' });
		}
	},
];

const updatePassword = [
	validateUpdatePassword,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { password, userId } = req.body;

			if (!userId) {
				return res.status(400).json({ message: 'Include valid UserID' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const user = await User.findByIdAndUpdate(userId, {
				password: hashedPassword,
			});
			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			res.json({ message: 'Password updated successfully.' });
		} catch (error) {
			console.error('Error updating password:', error);
			res.status(500).json({ message: 'Internal Server Error.' });
		}
	},
];

const updateName = [
	validateUpdateName,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { firstName, lastName, userId } = req.body;

			if (!userId) {
				return res.status(400).json({ message: 'Include valid UserID' });
			}

			const user = await User.findByIdAndUpdate(
				userId,
				{ firstName, lastName },
				{ new: true }
			);
			if (!user) {
				return res.status(404).json({ message: 'User not found.' });
			}

			res.json({ message: 'Name updated successfully.', user });
		} catch (error) {
			console.error('Error updating name:', error);
			res.status(500).json({ message: 'Internal Server Error.' });
		}
	},
];

const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users' });
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({ message: 'Include valid UserID' });
		}

		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		res.json({ message: 'User deleted successfully.' });
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ message: 'Internal Server Error.' });
	}
};

export {
	updateUsername,
	updateEmail,
	updatePassword,
	updateName,
	getAllUsers,
	deleteUser,
};
