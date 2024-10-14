import { Router } from 'express';
import { uploadFile, processFile } from '../controller/fileController';

const router = Router();

// Upload and process file
router.post('/upload', uploadFile, processFile);

export default router;
