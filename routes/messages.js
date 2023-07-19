const express = require('express');

const router = express.Router();

const messageController = require('../controllers/messageController');

// routes without parameters must come before routes with parameters
router.get('/messages', messageController.messages_get);

module.exports = router;
