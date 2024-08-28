import { Router } from 'express';
import {
	updateUsername,
	updateEmail,
	updatePassword,
	updateName,
	getAllUsers,
	getUserById,
	deleteUser,
	searchUsers,
} from '../controllers/user';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';

const userRoutes = Router();

userRoutes.put('/username', authenticate, ...updateUsername);
userRoutes.put('/email', authenticate, ...updateEmail);
userRoutes.put('/password', authenticate, ...updatePassword);
userRoutes.put('/name', authenticate, ...updateName);
userRoutes.get('/all', authenticate, isAdmin, getAllUsers);
userRoutes.get('/:userId', authenticate, getUserById);
userRoutes.delete('/', authenticate, isAdmin, deleteUser);
userRoutes.get('/search/:query', authenticate, isAdmin, searchUsers);

export default userRoutes;
