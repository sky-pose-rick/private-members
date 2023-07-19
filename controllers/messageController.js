exports.messages_get = (req, res, next) => {
  res.render('messages', {
    user: req.user,
  });
};
