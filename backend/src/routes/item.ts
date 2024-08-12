import { Router } from 'express';
import { authenticate } from '../passportConfig';
import {
	createItem,
	getItems,
	getItem,
	updateItem,
	deleteItem,
} from '../controllers/item';

const itemRoutes = Router();

itemRoutes.post('/', authenticate, createItem);
itemRoutes.get('/', authenticate, getItems);
itemRoutes.get('/:id', authenticate, getItem);
itemRoutes.put('/:id', authenticate, updateItem);
itemRoutes.delete('/:id', authenticate, deleteItem);

export default itemRoutes;
