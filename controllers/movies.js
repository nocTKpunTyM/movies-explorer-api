const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');

const {
  NOT_FOUND_FILM,
  NOT_FOUND_FILMS,
  NOT_VALID,
  CANT_DEL_FILM,
} = require('../utils/messages');

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(NOT_VALID));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError(NOT_FOUND_FILMS))
    .then((movies) => {
      res.send(movies);
    })
    .catch((next));
};

const delMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(new NotFoundError(NOT_FOUND_FILM))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(CANT_DEL_FILM);
      } else {
        Movie.deleteOne(movie)
          .then((del) => {
            res.send(del);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  delMovie,
};
