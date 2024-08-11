import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Application } from 'express';

import User from './models/User';

export const applyPassportStrategy = (app: Application): void => {
	const options = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET as string,
	};

	passport.use(
		new JwtStrategy(options, (jwt_payload, done) => {
			User.findOne({ _id: jwt_payload.sub })
				.then((user) => {
					done(null, user);
				})
				.catch((err) => {
					done(err, false);
				});
		})
	);

	app.use(passport.initialize());
};

export const authenticate = passport.authenticate('jwt', { session: false });
