import {
	connectToDatabase,
	closeDatabaseConnection,
	uploadToGridFS,
} from '../fileStorageConfig';
import { Request, Response, NextFunction } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.file) {
			throw new Error('No file uploaded');
		}
		const uploadedFile = await uploadToGridFS(req.file, req.body);
		res.json({
			message: 'File uploaded successfully',
			fileDetails: uploadedFile,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error uploading file', error: error });
	}
};

const getAllFiles = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const db = client.db('print3d');
		const filesCollection = db.collection('StorageBucket.files');
		const files = await filesCollection.find().toArray();
		res.json(files);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching files' });
	} finally {
		closeDatabaseConnection(client);
	}
};

const getFileByName = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const db = client.db();
		const filesCollection = db.collection('StorageBucket.files');
		const file = await filesCollection.findOne({
			filename: req.params.filename,
		});
		res.json(file);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching file' });
	} finally {
		closeDatabaseConnection(client);
	}
};

const getFileById = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const db = client.db();
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });
		const id = new ObjectId(req.params.id);

		const downloadStream = bucket.openDownloadStream(id);

		downloadStream.on('error', (err: Error) => {
			console.error(err);
			res.status(404).json({ message: 'File not found' });
			closeDatabaseConnection(client);
		});

		downloadStream.on('file', (file: Express.Multer.File) => {
			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader(
				'Content-Disposition',
				`attachment; filename="${file.filename}"`
			);
		});

		downloadStream.on('end', () => {
			closeDatabaseConnection(client);
		});

		downloadStream.pipe(res);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching file' });
		closeDatabaseConnection(client);
	}
};

export { uploadFile, getAllFiles, getFileByName, getFileById };
