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
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
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
		},
	},
	{
		timestamps: true,
	}
);

const Item = mongoose.model('Item', ItemSchema);

export default Item;
