import { Application } from 'express';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
// const rateLimit = require('express-rate-limit'); // Uncomment when express-rate-limit is installed

export function configureExpressMiddlewares(app: Application) {
	// Basic middleware
	app.use(express.json({ limit: '10mb' }));
	app.use(
		express.urlencoded({
			extended: true,
			limit: '10mb',
		})
	);

	// CORS configuration
	const corsOptions = {
		origin: process.env.FRONTEND_URL || 'http://localhost:4200',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	};

	app.use(cors(corsOptions));

	// Security middleware
	app.use(helmet());

	// Rate limiting (uncomment when express-rate-limit is installed)
	// const limiter = rateLimit({
	// 	windowMs: 15 * 60 * 1000, // 15 minutes
	// 	max: 100, // limit each IP to 100 requests per windowMs
	// 	message: 'Too many requests from this IP, please try again later.'
	// });
	// app.use('/auth', limiter);

	// Logging
	const accessLogStream = fs.createWriteStream(
		path.join(__dirname, '../access.log'),
		{ flags: 'a' }
	);

	app.use(morgan('combined', { stream: accessLogStream }));
	if (process.env.NODE_ENV !== 'production') {
		app.use(morgan('dev'));
	}
}
