import { Application } from 'express';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

export function configureExpressMiddlewares(app: Application) {
	app.use(express.json());
	app.use(
		express.urlencoded({
			extended: true,
		})
	);

	const accessLogStream = fs.createWriteStream(
		path.join(__dirname, 'access.log'),
		{ flags: 'a' }
	);

	app.use(morgan('combined', { stream: accessLogStream }));
	app.use(morgan('dev'));
}
