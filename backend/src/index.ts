import 'dotenv/config';
import http from 'http';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { applyPassportStrategy } from './passportConfig';
import { configureExpressMiddlewares } from './middlewares/middlewares';

import authRoutes from './routes/auth';
import filesRoutes from './routes/fileStorage';
import itemRoutes from './routes/item';
import orderRoutes from './routes/order';
import supportRoutes from './routes/support';
import userRoutes from './routes/user';

const app: Application = express();

applyPassportStrategy(app);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

configureExpressMiddlewares(app);

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to the print3d.tools!');
});

app.use('/auth', authRoutes);
app.use('/storage', filesRoutes);
app.use('/items', itemRoutes);
app.use('/orders', orderRoutes);
app.use('/support', supportRoutes);
app.use('/users', userRoutes);

const mongoUser = process.env.DB_USER;
const mongoPass = process.env.DB_PASSWORD;

if (!mongoUser || !mongoPass) {
	console.error(
		'Missing required environment variables: DB_USER and/or DB_PASSWORD'
	);
	process.exit(1);
}

const mongoUri = `mongodb://${mongoUser}:${mongoPass}@localhost:27017/`;

// Set mongoose debug mode only in development
if (process.env.NODE_ENV === 'development') {
	mongoose.set('debug', true);
}

mongoose
	.connect(mongoUri, {
		dbName: 'print3d',
	})
	.then(async () => {
		console.log('Connected to MongoDB');

		server.listen(PORT);
		console.log(`App is listening on port: ${PORT}`);
	})
	.catch((err) => {
		console.log(err);
	});
