import { Router } from 'express';
import { upload } from '../fileStorageConfig';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';
import {
	uploadFile,
	getAllFiles,
	searchFiles,
	getFileById,
	downloadFileById,
	filterUserFiles,
	deleteFileById,
	getFilesByOwnerId,
} from '../controllers/fileStorage';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/files', authenticate, isAdmin, getAllFiles);
router.get('/search/:query', authenticate, isAdmin, searchFiles);
router.get('/file/:fileId', authenticate, getFileById);
router.get('/files/owner/:ownerId', authenticate, filterUserFiles);
router.get('/file/download/:fileId', authenticate, downloadFileById);
router.delete('/file/:fileId', authenticate, deleteFileById);

export default router;
