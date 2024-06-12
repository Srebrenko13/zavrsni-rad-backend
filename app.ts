import express, {Application, Express} from "express";
import * as dotenv from 'dotenv';
import {OpenAI} from "openai";
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/game', gameRouter);

app.listen(port, () => {
    console.log(`[server]: Started server at http://localhost:${port}`);
});

module.exports = app;
