import { Router } from 'express';
import { upload, uploadToGridFS } from '../fileStorageConfig';
import {
	uploadFile,
	getAllFiles,
	getFileByName,
	getFileById,
} from '../controllers/fileStorage';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/files', getAllFiles);
router.get('/files/:id', getFileById);
router.get('/files/:filename', getFileByName);

export default router;
