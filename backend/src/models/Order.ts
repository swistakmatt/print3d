import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	items: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Item',
			required: true,
		},
	],
	total: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
		default: 'Pending',
	},
	payment: {
		type: String,
		required: true,
		enum: ['Debit Card', 'PayPal', 'BLIK', 'Bank Transfer'],
	},
	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	postalCode: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	tracking: {
		type: String,
	},
	deliveredAt: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
