import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Types } from 'mongoose';
import Item from '../models/Item';

const isValidObjectId = (id: string): boolean => {
	return Types.ObjectId.isValid(id);
};

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

export const validateCreateItem = [
	body('name')
		.isLength({ min: 1, max: 100 })
		.withMessage('Name must be between 1 and 100 characters long.'),
	body('description')
		.isLength({ min: 1, max: 1000 })
		.withMessage('Description must be between 1 and 1000 characters long.'),
	body('category')
		.isLength({ min: 1, max: 50 })
		.withMessage('Category must be between 1 and 50 characters long.'),
	body('price')
		.optional()
		.isFloat({ min: 0 })
		.withMessage('Price must be a positive number.'),
	body('isPublic')
		.optional()
		.isBoolean()
		.withMessage('isPublic must be a boolean value.'),
];

const createItem = [
	validateCreateItem,
	handleValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const item = new Item(req.body);
			await item.save();
			res.status(201).json(item);
		} catch (error) {
			console.error('Error creating item:', error);
			res.status(500).json({ message: 'Failed to create item' });
		}
	},
];

const getItems = async (req: Request, res: Response) => {
	try {
		const items = await Item.find();
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getPublicItems = async (req: Request, res: Response) => {
	try {
		const items = await Item.find({ isPublic: true });
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const filterPublicItems = async (req: Request, res: Response) => {
	try {
		const { search = '' } = req.query;

		const items = await Item.aggregate([
			{ $match: { isPublic: true, name: { $regex: search, $options: 'i' } } },
			{
				$addFields: {
					priceExists: {
						$cond: { if: { $gt: ['$price', null] }, then: 1, else: 0 },
					},
				},
			},
			{ $sort: { priceExists: -1, name: 1 } },
			{ $project: { priceExists: 0 } },
		]);

		res.json(items);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching public items' });
	}
};

const searchItems = async (req: Request, res: Response) => {
	try {
		const { query } = req.params;

		const items = await Item.find({
			$or: [
				{ name: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } },
			],
		});
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid item ID format.' });
		}

		const item = await Item.findById(id);
		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}
		res.json(item);
	} catch (error) {
		console.error('Error fetching item:', error);
		res.status(500).json({ message: 'Failed to fetch item' });
	}
};

const getItemsByOwnerId = async (req: Request, res: Response) => {
	try {
		const { ownerId } = req.params;

		if (!isValidObjectId(ownerId)) {
			return res.status(400).json({ message: 'Invalid owner ID format.' });
		}

		const items = await Item.find({ user: ownerId });
		res.json(items);
	} catch (error) {
		console.error('Error fetching items by owner:', error);
		res.status(500).json({ message: 'Failed to fetch items' });
	}
};

const updateItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid item ID format.' });
		}

		const item = await Item.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}
		res.json(item);
	} catch (error) {
		console.error('Error updating item:', error);
		res.status(500).json({ message: 'Failed to update item' });
	}
};

const deleteItem = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid item ID format.' });
		}

		const item = await Item.findByIdAndDelete(id);
		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}
		res.json({ message: 'Item deleted successfully', item });
	} catch (error) {
		console.error('Error deleting item:', error);
		res.status(500).json({ message: 'Failed to delete item' });
	}
};

export {
	createItem,
	getItems,
	getPublicItems,
	filterPublicItems,
	searchItems,
	getItem,
	getItemsByOwnerId,
	updateItem,
	deleteItem,
};
