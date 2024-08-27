import { Router } from 'express';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';
import {
	createOrder,
	getOrders,
	getUserOrders,
	getOrder,
	updateOrder,
	deleteOrder,
} from '../controllers/order';

const orderRoutes = Router();

orderRoutes.post('/', authenticate, createOrder);
orderRoutes.get('/', authenticate, isAdmin, getOrders);
orderRoutes.get('/user/:userId', authenticate, getUserOrders);
orderRoutes.get('/:id', authenticate, getOrder);
orderRoutes.put('/:id', authenticate, isAdmin, updateOrder);
orderRoutes.delete('/:id', authenticate, isAdmin, deleteOrder);

export default orderRoutes;
