import { Request, Response } from 'express';

import Support from '../models/Support';

const createSupportRequest = async (req: Request, res: Response) => {
	try {
		const supportRequest = new Support({
			user: req.body.userId,
			email: req.body.email,
			title: req.body.title,
			message: req.body.message,
		});

		await supportRequest.save();
		res.status(201).json({ message: 'Support request created successfully' });
	} catch (error) {
		console.error('Error creating support request:', error);
		res.status(500).json({ message: 'Failed to create support request' });
	}
};

const getSupportRequests = async (req: Request, res: Response) => {
	try {
		const supportRequests = await Support.find();
		res.json(supportRequests);
	} catch (error) {
		console.error('Error fetching support requests:', error);
		res.status(500).json({ message: 'Failed to fetch support requests' });
	}
};

const searchSupportRequests = async (req: Request, res: Response) => {
	try {
		const { query } = req.params;

		const supportRequests = await Support.find({
			$or: [
				{ email: { $regex: query, $options: 'i' } },
				{ title: { $regex: query, $options: 'i' } },
				{ message: { $regex: query, $options: 'i' } },
			],
		});
		res.json(supportRequests);
	} catch (error) {
		console.error('Error fetching support requests:', error);
		res.status(500).json({ message: 'Failed to fetch support requests' });
	}
};

const getSupportRequestById = async (req: Request, res: Response) => {
	try {
		const supportRequest = await Support.findById(req.params.id).populate(
			'user',
			'email'
		);
		if (!supportRequest) {
			return res.status(404).json({ message: 'Support request not found' });
		}
		res.json(supportRequest);
	} catch (error) {
		console.error('Error fetching support request:', error);
		res.status(500).json({ message: 'Failed to fetch support request' });
	}
};

const resolveSupportRequest = async (req: Request, res: Response) => {
	try {
		const supportRequest = await Support.findById(req.params.id);
		if (!supportRequest) {
			return res.status(404).json({ message: 'Support request not found' });
		}

		supportRequest.resolved = true;
		await supportRequest.save();

		res.json({ message: 'Support request resolved' });
	} catch (error) {
		console.error('Error resolving support request:', error);
		res.status(500).json({ message: 'Failed to resolve support request' });
	}
};

const deleteSupportRequest = async (req: Request, res: Response) => {
	try {
		const supportRequest = await Support.findByIdAndDelete(req.params.id);
		if (!supportRequest) {
			return res.status(404).json({ message: 'Support request not found' });
		}
		res.json(supportRequest);
	} catch (error) {
		console.error('Error deleting support request:', error);
		res.status(500).json({ message: 'Failed to delete support request' });
	}
};

export {
	createSupportRequest,
	getSupportRequests,
	searchSupportRequests,
	getSupportRequestById,
	resolveSupportRequest,
	deleteSupportRequest,
};
