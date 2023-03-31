const express = require('express');
const { registerUser, loginUser, logOutUser, generate2FACode } = require('../controllers/authController');
const router = express();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logOutUser)
router.post('/2fa/generate', generate2FACode );

module.exports = router;