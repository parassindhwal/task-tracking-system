const router = require('express').Router();
const { register, login, createUserProfile, getUserProfile, updateUserProfile, logout } = require('../../controllers/users');
const { validateLogin, validateUserProfileData } = require('../../utils/validators')
const { verifyToken } = require('../../utils/middlewares/verifyAuthToken');

router.post('/register', validateLogin, register)

router.post('/login', validateLogin, login)

router.post('/logout', verifyToken, logout)

router.post('/profile', verifyToken, validateUserProfileData, createUserProfile)

router.get('/profile', verifyToken, getUserProfile)

router.put('/profile', verifyToken, validateUserProfileData, updateUserProfile);

module.exports = router;