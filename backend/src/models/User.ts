import mongoose from 'mongoose';

const emailRegex =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema(
	{
		admin: {
			type: Boolean,
			default: false,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			match: emailRegex,
		},
		username: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 12,
		},
		firstName: {
			type: String,
			trim: true,
			minlength: 2,
			maxlength: 30,
		},
		lastName: {
			type: String,
			trim: true,
			minlength: 2,
			maxlength: 30,
		},
		phone: {
			type: String,
			trim: true,
			minlength: 9,
			maxlength: 15,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', UserSchema);

export default User;
