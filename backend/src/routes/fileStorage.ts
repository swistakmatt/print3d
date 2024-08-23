import { Router } from 'express';
import { upload } from '../fileStorageConfig';
import { authenticate } from '../passportConfig';
import { isAdmin } from '../middlewares/isAdmin';
import {
	uploadFile,
	getAllFiles,
	searchFileById,
	downloadFileById,
	filterUserFiles,
	deleteFileById,
	getFilesByOwnerId,
} from '../controllers/fileStorage';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/files', authenticate, isAdmin, getAllFiles);
router.get('/file/:fileId', authenticate, isAdmin, searchFileById);
router.get('/files/owner/:ownerId', authenticate, filterUserFiles);
router.get('/file/download/:fileId', authenticate, downloadFileById);
router.delete('/file/:fileId', authenticate, deleteFileById);

export default router;
