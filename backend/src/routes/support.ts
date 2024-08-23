import { Router } from 'express';
import {
	createSupportRequest,
	getSupportRequests,
	getSupportRequestById,
	resolveSupportRequest,
} from '../controllers/support';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.post('/', createSupportRequest);
router.get('/', authenticate, isAdmin, getSupportRequests);
router.get('/:id', authenticate, isAdmin, getSupportRequestById);
router.put('/:id/resolve', authenticate, isAdmin, resolveSupportRequest);

export default router;
