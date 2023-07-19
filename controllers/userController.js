const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');

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
  if (req.user) { res.redirect('/'); }

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
    .withMessage(`Names must be shorter than ${MAX_NAME_LENGTH} characters.`)
    .custom(async (value) => {
      // detect duplicate username
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already taken');
      }
    }),
  body('password', 'Password be at least 5 characters long.')
    .isLength({ min: 5 }),
  body('passwordVerify', 'Passwords must match.')
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
    });

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
      user.password = hashedPassword;
      user.save()
        .then((newUser) => res.redirect('/memberboard/login'))
        .catch((saveErr) => next(saveErr));
    });
  },
];

exports.login_get = (req, res, next) => {
  if (req.session.user) { res.redirect('/'); }

  res.render('login', {
    title: 'Login',
  });
};

exports.login_post = [
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must not be empty.')
    .isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // render again
      res.render('login', {
        title: 'Login',
        user: { username: req.body.username },
        errors: errors.array(),
      });
      return;
    }

    passport.authenticate('local', (err, user, info, status) => {
      if (err) { next(err); }
      if (!user) {
        return res.render('login', {
          title: 'Login',
          user: { username: req.body.username },
          errors: [{ msg: 'Incorrect username or password.' }],
        });
      }
      // valid login
      req.login(user, (loginError) => {
        if (loginError) { next(err); }
        res.redirect('/');
      });
    })(req, res, next);
  },
];

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) { next(err); }
    res.redirect('/');
  });
};
