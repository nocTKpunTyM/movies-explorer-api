const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const NOT_FOUND_404 = require('../utils/messages');
const { signinValidation, signupValidation } = require('../middlewares/celebrate');

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use((req, res, next) => {
  next(new NotFoundError({ message: NOT_FOUND_404 }));
});

module.exports = router;
