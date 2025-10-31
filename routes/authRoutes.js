const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.put('/update/:id', authMiddleware, upload.single('profileImage'), updateProfile);

module.exports = router;
