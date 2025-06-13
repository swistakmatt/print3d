import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 100,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 1000,
		},
		category: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 50,
		},
		image: {
			type: String,
			trim: true,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
		price: {
			type: Number,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Item = mongoose.model('Item', ItemSchema);

export default Item;
