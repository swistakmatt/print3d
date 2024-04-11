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
			User.findOne({ id: jwt_payload.sub }, (err: Error, user: any) => {
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		})
	);

	app.use(passport.initialize());
};
