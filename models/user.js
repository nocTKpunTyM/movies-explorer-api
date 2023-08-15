const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthError = require('../errors/auth-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      minlength: [2, 'Минимальная длинна поля "Имя" 2 символа'],
      maxlength: [30, 'Максимальная длинна поля "Имя" 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: false,
      minlength: [2, 'Минимальная длинна поля "О себе" 2 символа'],
      maxlength: [30, 'Максимальная длинна поля "О себе" 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
