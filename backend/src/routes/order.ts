import { Router } from 'express';
import { authenticate } from '../passportConfig';
import {
	createOrder,
	getOrders,
	getOrder,
	updateOrder,
	deleteOrder,
} from '../controllers/order';

const orderRoutes = Router();

orderRoutes.post('/', authenticate, createOrder);
orderRoutes.get('/', authenticate, getOrders);
orderRoutes.get('/:id', authenticate, getOrder);
orderRoutes.put('/:id', authenticate, updateOrder);
orderRoutes.delete('/:id', authenticate, deleteOrder);

export default orderRoutes;
