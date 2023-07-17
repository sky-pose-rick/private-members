const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Message = require('../models/message');

const MAX_NAME_LENGTH = 50;

const signupValidators = [
  body('firstName', 'First Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: MAX_NAME_LENGTH })
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`),
  body('lastName', 'Last Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: MAX_NAME_LENGTH })
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`),
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: MAX_NAME_LENGTH })
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`),
  body('password', 'Password be at least 5 characters long.')
    .isLength({ min: 5 }),
  body('passwordVerify', 'Passwords must match.')
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),
];

exports.signup_get = (req, res, next) => {
  // TODO: if logged in, redirect

  res.render('sign-up', {
    title: 'Sign Up',
  });
};

exports.signup_post = [
  body('firstName', 'First Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: MAX_NAME_LENGTH })
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`),
  body('lastName', 'Last Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: MAX_NAME_LENGTH })
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`),
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isLength({ max: MAX_NAME_LENGTH })
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`),
  body('password', 'Password be at least 5 characters long.')
    .isLength({ min: 5 }),
  body('passwordVerify', 'Passwords must match.')
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
    };

    // TODO: check for unique username

    if (!errors.isEmpty()) {
      // render again
      res.render('sign-up', {
        title: 'Sign Up',
        user,
        errors: errorsArray,
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) { return next(err); }
      // TODO: create user
      res.redirect('/memberboard/messages');
    });
  },
];
