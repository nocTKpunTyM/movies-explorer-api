const express = require('express');
// const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const { errors } = require('celebrate');
// const NotFoundError = require('./errors/not-found-err');
// const { signinValidation, signupValidation } = require('./middlewares/celebrate');
// const cors = require('./middlewares/cors');

// const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
// mongoose.connect(DB_URL);

const app = express();
// const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// app.use(cors);

// const usersRouter = require('./routes/users');
// const cardsRouter = require('./routes/cards');

// const { createUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');
// const errorsMid = require('./middlewares/errors');

app.use(express.json());
// app.use(requestLogger); // подключаем логгер запросов

// app.post('/signin', signinValidation, login);
// app.post('/signup', signupValidation, createUser);
// app.use('/users', auth, usersRouter);
// app.use('/cards', auth, cardsRouter);

/*
app.use((req, res, next) => {
  next(new NotFoundError({ message: 'Страница не найдена' }));
});
*/

// app.use(errorLogger);
// app.use(errors());
// app.use(errorsMid);
// app.listen(3000);
app.listen(3000, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log('App listening on port 3000');
});
