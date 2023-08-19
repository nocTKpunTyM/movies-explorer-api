require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ReplicateError = require('../errors/replicate-err');
const ValidationError = require('../errors/validation-err');

const {
  NOT_FOUND_USER,
  NOT_VALID,
  REPLICATE_EMAIL,
} = require('../utils/messages');

const createUser = (req, res, next) => {
  const { password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ ...req.body, password: hash })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ReplicateError(REPLICATE_EMAIL));
          } else if (err.name === 'ValidationError') {
            next(new ValidationError(NOT_VALID));
          } else {
            next(err);
          }
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(NOT_VALID));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(new NotFoundError(NOT_FOUND_USER))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((next));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError(NOT_FOUND_USER))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(NOT_VALID));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  login,
};
