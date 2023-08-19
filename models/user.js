const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthError = require('../errors/auth-err');

const {
  NOT_AUTH,
} = require('../utils/messages');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длинна поля "Имя" 2 символа'],
      maxlength: [30, 'Максимальная длинна поля "Имя" 30 символов'],
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'Поле "Электронная почта" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректый email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "Пароль" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(NOT_AUTH);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(NOT_AUTH);
          }
          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
