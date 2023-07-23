const { body, validationResult } = require('express-validator');

const Message = require('../models/message');

require('dotenv').config();

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
  if (!req.user || !req.user.isAdmin) {
    res.render('transition', {
      title: 'Insufficient Privilege',
      user: req.user,
      messages: ['You must be an admin to do that.'],
      links: [{
        url: '/',
        text: 'Back to Home',
      }],
    });
  }

  Message.deleteOne({ _id: req.params.id })
    .then(() => {
      res.render('transition', {
        title: 'Message Deleted',
        user: req.user,
        messages: ['Message successfully deleted.'],
        links: [{
          url: '/',
          text: 'Back to Home',
        }],
      });
    })
    .catch((err) => { next(err); });
};

exports.posting_get = (req, res, next) => {
  if (!req.user) {
    res.render('transition', {
      title: 'Insufficient Privilege',
      user: req.user,
      messages: ['You must be signed in to do that.'],
      links: [{
        url: '/',
        text: 'Back to Home',
      }],
    });
  }

  res.render('posting', {
    title: 'New Message',
    user: req.user,
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
        user: req.user,
        errors: [{ msg: 'Not signed in' }],
      });
      return;
    }

    if (!errors.isEmpty()) {
      // re-render
      res.render('posting', {
        title: 'New Message',
        message,
        user: req.user,
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

exports.about_get = (req, res, next) => {
  res.render('about', {
    title: 'About Memberboard',
    user: req.user,
    memberCode: process.env.MEMBER_RANK_PASSWORD,
  });
};
