const express = require('express');
const { loginUser, RegisterUser } = require('../controller/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register',RegisterUser)
module.exports = router;
