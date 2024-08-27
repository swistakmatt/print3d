import { Router } from 'express';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';
import {
	createItem,
	getItems,
	getPublicItems,
	filterPublicItems,
	getItem,
	getItemsByOwnerId,
	updateItem,
	deleteItem,
} from '../controllers/item';

const itemRoutes = Router();

itemRoutes.post('/', authenticate, createItem);
itemRoutes.get('/', authenticate, isAdmin, getItems);
itemRoutes.get('/public', filterPublicItems);
itemRoutes.get('/:id', authenticate, getItem);
itemRoutes.get('/owner/:ownerId', authenticate, getItemsByOwnerId);
itemRoutes.put('/:id', authenticate, updateItem);
itemRoutes.delete('/:id', authenticate, deleteItem);

export default itemRoutes;
