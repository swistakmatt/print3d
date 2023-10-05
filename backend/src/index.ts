require('dotenv').config();

import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { configureExpressMiddlewares } from './middlewares';

import './controllers/auth';
import http from 'http';

const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

configureExpressMiddlewares(app);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to the eSport Drafts API!');
});

mongoose
	.connect(process.env.MONGO_URL || 'mongodb://localhost:2137')
	.then(async () => {
		console.log('Connected to MongoDB');

		server.listen(PORT);
		console.log(`App is listening on port: ${PORT}`);
	})
	.catch((err) => {
		console.log(err);
	});
