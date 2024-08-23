import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		email: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
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
