const express = require('express');
const { registerUser } = require('../controllers/authController');
const router = express();

router.post('/register', registerUser)

module.exports = router;