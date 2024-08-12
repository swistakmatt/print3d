import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
	{
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
