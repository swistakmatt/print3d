import { Request, Response } from 'express';

import Support from '../models/Support';

// Create a new support request
const createSupportRequest = async (req: Request, res: Response) => {
	try {
		const supportRequest = new Support({
			user: req.user,
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
		const supportRequests = await Support.find().populate('user', 'email');
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

export {
	createSupportRequest,
	getSupportRequests,
	getSupportRequestById,
	resolveSupportRequest,
};
