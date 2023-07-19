const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// routes without parameters must come before routes with parameters

router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);
router.post('/login', userController.login_post);

router.get('/logout', userController.logout_get);

module.exports = router;
