const express = require('express');
const { loginUser, RegisterUser, verifyToken, getAvatarUrl } = require('../controller/authController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register',RegisterUser);
router.get('/verifyToken',verifyToken);
router.get('/getUserAvatar',authenticateToken, getAvatarUrl);
module.exports = router;
