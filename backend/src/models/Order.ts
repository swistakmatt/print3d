import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
	{
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
		filament_type: {
			type: String,
			required: true,
		},
		filament_color: {
			type: String,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
			default: 'processing',
		},
		payment_method: {
			type: String,
			required: true,
			enum: ['Debit Card', 'PayPal', 'BLIK', 'Bank Transfer'],
		},
		payment_status: {
			type: String,
			required: true,
			enum: ['processing', 'requires_action', 'succeeded', 'failed'],
			default: 'processing',
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
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
