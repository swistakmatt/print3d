import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';
import { Application, Request, Response } from 'express';
import { applyPassportStrategy } from './passportConfig';
import { configureExpressMiddlewares } from './middlewares';

import authRoutes from './routes/auth';
import filesRoutes from './routes/fileStorage';

const express = require('express');

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

const mongoUser = process.env.DB_USER;
const mongoPass = process.env.DB_PASSWORD;
const mongoUri = `mongodb://${mongoUser}:${mongoPass}@localhost:27017/`;

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
