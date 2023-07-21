const { body, validationResult } = require('express-validator');

const Message = require('../models/message');

exports.messages_get = (req, res, next) => {
  Message.find()
    .then((messages) => {
      res.render('messages', {
        messages,
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.message_get = (req, res, next) => {
  Message.findOne({ _id: req.params.id })
    .populate('author')
    .then((message) => {
      if (message == null) {
        const notFound = new Error('Message not found');
        notFound.status = 404;
        return next(notFound);
      }

      res.render('message', {
        user: req.user,
        message,
      });
    })
    .catch((err) => { next(err); });
};

exports.message_delete = (req, res, next) => {
  console.log('delete route called');
  if (!req.user || !req.user.isAdmin) {
    res.redirect('/');
  }

  Message.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => { next(err); });
};

exports.posting_get = (req, res, next) => {
  if (!req.user) { res.redirect('/'); }

  res.render('posting', {
    title: 'New Message',
  });
};

exports.posting_post = [
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: 100 })
    .withMessage(`Title must be shorter than ${100} characters.`),
  body('content', 'Content must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      content: req.body.content,
    });

    if (!req.user) {
      // not signed in
      res.render('posting', {
        title: 'New Message',
        message,
        errors: [{ msg: 'Not signed in' }],
      });
      return;
    }

    if (!errors.isEmpty()) {
      // re-render
      res.render('posting', {
        title: 'New Message',
        message,
        errors: errors.array(),
      });
      return;
    }

    message.author = req.user;
    message.timestamp = Date.now();

    message.save()
      .then((newMessage) => {
        res.redirect(newMessage.url);
      })
      .catch((err) => {
        next(err);
      });
  }];
