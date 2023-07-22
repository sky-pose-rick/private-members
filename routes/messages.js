const express = require('express');

const router = express.Router();

const messageController = require('../controllers/messageController');

// routes without parameters must come before routes with parameters
router.get('/messages', messageController.messages_get);

router.get('/post', messageController.posting_get);
router.post('/post', messageController.posting_post);

router.get('/messages/:id', messageController.message_get);
router.post('/messages/:id', messageController.message_delete);

router.get('/about', messageController.about_get);

module.exports = router;
