const router = require('express').Router();
const {
  createCard,
  getCards,
  delCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardValidation } = require('../middlewares/celebrate');

router.post('/', createCardValidation, createCard);
router.get('/', getCards);
router.delete('/:id', cardValidation, delCard);
router.put('/:id/likes', cardValidation, likeCard);
router.delete('/:id/likes', cardValidation, dislikeCard);

module.exports = router;
