// import MongoStore from "connect-mongo";
import { Application } from 'express';
// import session from "express-session";
import passport from 'passport';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// export const sessionMiddleware = session({
//   secret: process.env.SESSION_SECRET || "default_secret",
//   resave: false,
//   saveUninitialized: false,
//   name: "ninja-cookie",
//   cookie: {
//     signed: true,
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24,
//   },
//   // store: MongoStore.create({
//   //   mongoUrl: process.env.MONGO_URL || "mongodb://localhost:2137",
//   // }),
// });

export function configureExpressMiddlewares(app: Application) {
	app.use(express.json());

	const accessLogStream = fs.createWriteStream(
		path.join(__dirname, 'access.log'),
		{ flags: 'a' }
	);

	app.use(morgan('combined', { stream: accessLogStream }));
	app.use(morgan('dev'));

	// app.use(sessionMiddleware);

	app.use(passport.initialize());
	app.use(passport.session());
}
