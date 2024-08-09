import express, {Application, Express} from "express";
import * as dotenv from 'dotenv';
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');
const profileRouter = require('./routes/profile');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function isAuthenticated (req: any, res: any, next: any) {
    if (req.session.user) next()
    else next('route')
}

app.use('/', indexRouter);
app.use('/game', gameRouter);
app.use('/profile', profileRouter);

app.listen(port, () => {
    console.log(`[server]: Started server at http://localhost:${port}`);
});

module.exports = app;
