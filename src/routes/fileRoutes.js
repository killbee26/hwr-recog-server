const express = require('express');
const { uploadFile, processFile } = require('../controller/fileController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Upload and process the file
router.post('/upload', uploadFile, processFile,authenticateToken);

module.exports = router;
