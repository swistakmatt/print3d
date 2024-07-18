import { Router } from 'express';
import { uploadFile } from '../controllers/upload';

const uploadRoutes = Router();

uploadRoutes.post('/upload', uploadFile);

export default uploadRoutes;
