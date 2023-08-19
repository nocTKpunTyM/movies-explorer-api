const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { DB_URL } = require('./utils/config');
const limiter = require('./utils/limiter');
const routers = require('./routes');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
mongoose.connect(DB_URL);

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(helmet());

app.use(limiter);

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

const errorsMid = require('./middlewares/errors');

app.use(express.json());
app.use(requestLogger);

app.use(routers);

app.use(errorLogger);
app.use(errors());
app.use(errorsMid);
app.listen(PORT);
