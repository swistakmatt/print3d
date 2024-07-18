import File from '../models/File';

import { Request, Response } from 'express';

export const uploadFile = async (req: Request, res: Response) => {
	try {
		const file = new File({
			userId: req.body.userId,
			// fileType: req.file.mimetype,
			// filePath: req.file.path,
			// fileName: req.file.filename,
		});
		await file.save();
		res.status(201).json({ message: 'File uploaded successfully', file });
	} catch (error) {
		res.status(500).json({ message: 'File upload failed', error });
	}
};
