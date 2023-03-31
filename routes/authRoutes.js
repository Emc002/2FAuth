const express = require('express');
const { registerUser, loginUser, logOutUser } = require('../controllers/authController');
const router = express();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logOutUser)

module.exports = router;