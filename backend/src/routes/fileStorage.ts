import { Router } from 'express';
import { upload } from '../fileStorageConfig';
import { authenticate } from '../passportConfig';
import {
	uploadFile,
	getAllFiles,
	searchFileById,
	downloadFileById,
	deleteFileById,
	getFilesByOwnerId,
} from '../controllers/fileStorage';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/files', authenticate, getAllFiles);
router.get('/file/:fileId', authenticate, searchFileById);
router.get('/files/owner/:ownerId', authenticate, getFilesByOwnerId);
router.get('/file/download/:fileId', authenticate, downloadFileById);
router.delete('/file/:fileId', authenticate, deleteFileById);

export default router;
