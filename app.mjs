import createHttpError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import cors from 'cors';
import { fetchTokens } from './public/javascripts/ActiveTokens.js';
import paymentRoute from './routes/mpesa.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './public/javascripts/databaseConn.js';
import bodyParser from 'body-parser'
import safaricomRoute from './routes/handleRespons.js';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import MongoStore from 'connect-mongo';
//import macAddressRoute from './routes/internetMacAddress.js';
import statementRoute from './routes/statementRoute.js';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from "passport-local";
import { userLoginRoute } from './routes/userLoginRoute.js';
import rateLimit from 'express-rate-limit';
import { checkTokenExpiry } from './public/javascripts/denieAccess.js';
import jwt from './routes/jwtRoute.js';
import crypto from 'crypto';
import LoginAdmin from './routes/adminLogin.js';
import adminToken from './routes/adminToken.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import corsOptions from './routes/corses.js';
//const {useragent} = pkg;
import firstTimeUser from './public/javascripts/firstTime.js';
import fetchRoute from './routes/fetchToken.js';
import sessionRoute from './routes/session.js';
import queryItems from './public/javascripts/unusedTokens.js';
import { deleteItems } from './public/javascripts/unusedTokens.js';
import Update from './routes/data.js';
import whatsapp from "./routes/test.js";
import phoneNumber from "./routes/phoneNumbers.js";
import sms from "./routes/Sms.js";
import contacts from "./routes/contacts.js";
import disconnect from './routes/disconnect.js';

const sessionSecret = crypto.randomBytes(32).toString('hex');
//import router from './routes/Hotspot.js';

var app = express();
connectDB();

//removeFromAcess();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions()));

setInterval(checkTokenExpiry, 1 * 60 * 1000);

//app.set('trust proxy', 1);

/*const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
*/

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: 'mongodb+srv://myAtlasDBUser:Enockay23@myatlasclusteredu.bfx6ekr.mongodb.net/Blackie-Networks',
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}));

app.get("/items",  queryItems);
app.get("/deleteItems/:id",deleteItems);
app.post("/api/callback", safaricomRoute);
app.use("/tokens", fetchRoute);
app.post('/session', sessionRoute)
app.post("/generateToken", adminToken);
app.post("/login",LoginAdmin)
app.post("/api/makePayment", paymentRoute);
app.post("/login/Api",userLoginRoute);
app.post("/api/jwt", jwt);
app.use('/update',Update);
app.use("/whatssap",whatsapp);
app.use("/phone",phoneNumber);
app.use("/sms",sms);
app.use("/cvs",contacts);
app.use("/disconnect",disconnect);

//app.use("/router",router);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Render a custom error view or send a JSON response
  res.status(500).render('error', { message: 'Something went wrong!' });
});


app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error';

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app
