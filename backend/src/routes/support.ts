import { Router } from 'express';
import {
	createSupportRequest,
	getSupportRequests,
	searchSupportRequests,
	getSupportRequestById,
	resolveSupportRequest,
	deleteSupportRequest,
} from '../controllers/support';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.post('/', createSupportRequest);
router.get('/', authenticate, isAdmin, getSupportRequests);
router.get('/search/:query', authenticate, isAdmin, searchSupportRequests);
router.get('/:id', authenticate, isAdmin, getSupportRequestById);
router.put('/:id/resolve', authenticate, isAdmin, resolveSupportRequest);
router.delete('/:id', authenticate, isAdmin, deleteSupportRequest);

export default router;
