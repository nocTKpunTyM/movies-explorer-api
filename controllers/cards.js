const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неккоректно введены данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Нет карточек'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((next));
};

const delCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(new NotFoundError('Нет такой карточки'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      } else {
        Card.deleteOne(card)
          .then((del) => {
            res.send(del);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: user } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет такой карточки'))
    .then((card) => {
      res.send(card);
    })
    .catch((next));
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: user } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет такой карточки'))
    .then((card) => {
      res.send(card);
    })
    .catch((next));
};

module.exports = {
  createCard,
  getCards,
  delCard,
  likeCard,
  dislikeCard,
};
