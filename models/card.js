const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "Название" должно быть заполнено'],
      minlength: [2, 'Минимальная длинна поля "Название" 2 символа'],
      maxlength: [30, 'Максимальная длинна поля "Название" 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле "Ссылка на фото" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

const User = mongoose.model('card', cardSchema);

module.exports = User;
