import { Request, Response } from 'express';

import Item from '../models/Item';

const createItem = async (req: Request, res: Response) => {
	try {
		const item = new Item(req.body);
		await item.save();
		res.json(item);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getItems = async (req: Request, res: Response) => {
	try {
		const items = await Item.find();
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getItem = async (req: Request, res: Response) => {
	try {
		const item = await Item.findById(req.params.id);
		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}
		res.json(item);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const updateItem = async (req: Request, res: Response) => {
	try {
		const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}
		res.json(item);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const deleteItem = async (req: Request, res: Response) => {
	try {
		const item = await Item.findByIdAndDelete(req.params.id);
		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}
		res.json(item);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export { createItem, getItems, getItem, updateItem, deleteItem };
