import { Application } from 'express';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

export function configureExpressMiddlewares(app: Application) {
	app.use(express.json());
	app.use(
		express.urlencoded({
			extended: true,
		})
	);

	app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

	app.use(helmet());

	const accessLogStream = fs.createWriteStream(
		path.join(__dirname, '../access.log'),
		{ flags: 'a' }
	);

	app.use(morgan('combined', { stream: accessLogStream }));
	app.use(morgan('dev'));
}
