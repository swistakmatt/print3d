import { Router } from 'express';
import {
	updateUsername,
	updateEmail,
	updatePassword,
	updateName,
	getAllUsers,
	deleteUser,
} from '../controllers/user';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';

const userRoutes = Router();

userRoutes.put('/username', authenticate, ...updateUsername);
userRoutes.put('/email', authenticate, ...updateEmail);
userRoutes.put('/password', authenticate, ...updatePassword);
userRoutes.put('/name', authenticate, ...updateName);
userRoutes.get('/all', authenticate, isAdmin, getAllUsers);
userRoutes.delete('/', authenticate, isAdmin, deleteUser);

export default userRoutes;
