const express = require('express');
const { uploadFile, processFile } = require('../controller/fileController');
const authenticateToken = require('../middlewares/auth');
const multer = require('multer');
const router = express.Router();

// Upload and process the file
router.post('/upload', authenticateToken,uploadFile, processFile);

module.exports = router;
