import mongoose from 'mongoose';
import { MongoClient, GridFSBucket } from 'mongodb';

const multer = require('multer');
const stream = require('stream');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const mongoUser = process.env.DB_USER ?? 'DEV_USR';
const mongoPass = process.env.DB_PASSWORD ?? 'DEV_PASSWD';

const host = process.env.DB_HOST ?? 'localhost';
const port = parseInt(process.env.DB_PORT ?? '27017');
const url = `mongodb://${host}:${port}`;

const connectToDatabase = async () => {
	const client = new MongoClient(url, {
		authSource: 'admin',
		auth: {
			username: mongoUser,
			password: mongoPass,
		},
	});
	try {
		await client.connect();
		return client;
	} catch (error) {
		console.error('Failed to connect to MongoDB', error);
		throw error;
	}
};

const closeDatabaseConnection = async (client: MongoClient) => {
	try {
		await client.close();
	} catch (error) {
		console.error('Failed to close MongoDB connection', error);
	}
};

const uploadToGridFS = async (file: Express.Multer.File, metadata: any) => {
	const client = await connectToDatabase();
	try {
		const db = client.db('print3d');
		const bucket = new GridFSBucket(db, { bucketName: 'StorageBucket' });

		const uploadStream = bucket.openUploadStream(file.originalname, {
			metadata,
		});
		const bufferStream = stream.Readable.from(file.buffer);

		return new Promise((resolve, reject) => {
			bufferStream
				.pipe(uploadStream)
				.on('error', (err: Error) => {
					reject(err);
					closeDatabaseConnection(client);
				})
				.on('finish', () => {
					resolve({
						fileId: uploadStream.id,
						filename: uploadStream.filename,
					});
					closeDatabaseConnection(client);
				});
		});
	} catch (error) {
		closeDatabaseConnection(client);
		throw error;
	}
};

export { upload, uploadToGridFS, connectToDatabase, closeDatabaseConnection };
