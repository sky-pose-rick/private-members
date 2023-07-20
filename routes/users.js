const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// routes without parameters must come before routes with parameters

router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);
router.post('/login', userController.login_post);

router.get('/logout', userController.logout_get);

router.get('/member', userController.member_get);
router.post('/member', userController.member_post);
router.get('/admin', userController.admin_get);
router.post('/admin', userController.admin_post);

module.exports = router;
