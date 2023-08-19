const router = require('express').Router();
const {
  createMovie,
  getMovies,
  delMovie,
} = require('../controllers/movies');
const { createMovieValidation, movieValidation } = require('../middlewares/celebrate');

router.post('/', createMovieValidation, createMovie);
router.get('/', getMovies);
router.delete('/:id', movieValidation, delMovie);

module.exports = router;
