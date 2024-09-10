import { Request, Response } from 'express';

import Order from '../models/Order';

const createOrder = async (req: Request, res: Response) => {
	try {
		const order = new Order(req.body);
		await order.save();
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find().populate('items');
		if (!orders) {
			return res.status(404).json({ message: 'Orders not found.' });
		}

		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const searchOrders = async (req: Request, res: Response) => {
	try {
		const { query } = req.params;

		const orders = await Order.find({
			$or: [
				{ status: { $regex: query, $options: 'i' } },
				{ payment_status: { $regex: query, $options: 'i' } },
			],
		});
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getUserOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find({ user: req.params.userId }).populate(
			'items'
		);
		if (!orders) {
			return res.status(404).json({ message: 'Orders not found.' });
		}

		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getOrder = async (req: Request, res: Response) => {
	try {
		const order = await Order.findById(req.params.id).populate('items');
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const updateOrder = async (req: Request, res: Response) => {
	try {
		const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const deleteOrder = async (req: Request, res: Response) => {
	try {
		const order = await Order.findByIdAndDelete(req.params.id);
		if (!order) {
			return res.status(404).json({ message: 'Order not found.' });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export {
	createOrder,
	getOrders,
	searchOrders,
	getUserOrders,
	getOrder,
	updateOrder,
	deleteOrder,
};
