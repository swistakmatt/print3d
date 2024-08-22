import {
	connectToDatabase,
	closeDatabaseConnection,
	uploadToGridFS,
} from '../fileStorageConfig';
import { Request, Response, NextFunction } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import { FileMetadata } from '../types/File';

function toBoolean(value: any): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') return value.toLowerCase() === 'true';
	return false;
}

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.file) {
			throw new Error('No file uploaded');
		}

		const metadata: FileMetadata = {
			ownerId: req.body.ownerId,
		};

		const uploadedFile: any = await uploadToGridFS(req.file, metadata);

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
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const files = await bucket.find().toArray();

		res.json(files);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching files' });
	} finally {
		closeDatabaseConnection(client);
	}
};

const getFilesByOwnerId = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const db = client.db('print3d');
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const files = await bucket
			.find({ 'metadata.ownerId': req.params.ownerId })
			.toArray();

		res.json(files);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching files' });
	} finally {
		closeDatabaseConnection(client);
	}
};

const filterUserFiles = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const { ownerId } = req.params;
		const { query } = req.query;

		if (!ownerId) {
			return res.status(400).json({ error: { text: 'Owner ID not provided' } });
		}

		const db = client.db('print3d');
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const searchCriteria: any = { 'metadata.ownerId': ownerId };

		if (query) {
			searchCriteria.$or = [
				{ filename: { $regex: query, $options: 'i' } },
				{ 'metadata.customField': { $regex: query, $options: 'i' } },
			];
		}

		const files = await bucket.find(searchCriteria).toArray();

		res.json(files);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching files', error });
	} finally {
		closeDatabaseConnection(client);
	}
};

const searchFileById = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const { fileId } = req.params;

		if (!fileId) {
			return res.status(400).json({ error: { text: 'File ID not provided' } });
		}

		const parsedFileId = new ObjectId(fileId);

		const db = client.db('print3d');
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const file = await bucket.find({ _id: parsedFileId }).toArray();

		if (file.length === 0) {
			res.status(404).json({ message: 'File not found' });
		} else {
			res.json(file[0]);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching file' });
		closeDatabaseConnection(client);
	}
};

const downloadFileById = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const { fileId } = req.params;

		if (!fileId) {
			return res.status(400).json({ error: { text: 'File ID not provided' } });
		}

		const parsedFileId = new ObjectId(fileId);

		const db = client.db('print3d');
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const file = await bucket.find({ _id: parsedFileId }).toArray();

		if (file.length === 0) {
			return res.status(404).json({ error: { text: 'File not found' } });
		}

		const downloadStream = bucket.openDownloadStream(parsedFileId);

		downloadStream.on('error', (err: Error) => {
			console.error(err);
			res.status(404).json({ message: 'File not found' });
			closeDatabaseConnection(client);
		});

		downloadStream.on('file', (file: Express.Multer.File) => {
			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader(
				'Content-Disposition',
				`attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`
			);
		});

		downloadStream.on('end', () => {
			closeDatabaseConnection(client);
		});

		downloadStream.pipe(res);
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: { text: `Unable to download file`, error } });
	}
};

const deleteFileById = async (req: Request, res: Response) => {
	const client = await connectToDatabase();
	try {
		const { fileId } = req.params;

		if (!fileId) {
			return res.status(400).json({ error: { text: 'File ID not provided' } });
		}

		const parsedFileId = new ObjectId(fileId);

		const db = client.db('print3d');
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const file = await bucket.find({ _id: parsedFileId }).toArray();

		if (file.length === 0) {
			return res.status(404).json({ error: { text: 'File not found' } });
		}

		await bucket.delete(parsedFileId);

		res.json({ message: 'File deleted successfully' });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: { text: `Unable to delete file`, error } });
	}
};

export {
	uploadFile,
	getAllFiles,
	searchFileById,
	filterUserFiles,
	downloadFileById,
	deleteFileById,
	getFilesByOwnerId,
};
