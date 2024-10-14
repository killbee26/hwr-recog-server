const express = require('express');
const { uploadFile, processFile } = require('../controller/fileController');

const router = express.Router();

// Upload and process the file
router.post('/upload', uploadFile, processFile);

module.exports = router;
