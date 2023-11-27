import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		admin: {
			type: Boolean,
			default: false,
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minLength: 8,
		},
		phone: {
			type: Number,
			required: true,
			unique: true,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);
