import 'dotenv/config';

import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { configureExpressMiddlewares } from './middlewares';

import http from 'http';

const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

configureExpressMiddlewares(app);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to the print3d.tools!');
});

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
