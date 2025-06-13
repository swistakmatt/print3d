import mongoose from 'mongoose';

const emailRegex =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const supportSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			match: emailRegex,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 5,
			maxlength: 200,
		},
		message: {
			type: String,
			required: true,
			trim: true,
			minlength: 10,
			maxlength: 2000,
		},
		resolved: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Support = mongoose.model('Support', supportSchema);

export default Support;
