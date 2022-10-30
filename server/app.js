import express from 'express';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/usersRoute.js';
import petRoute from './routes/petsRoute.js';
import globalErrorHandler from './controllers/globalErrorHandler.js';
import * as appController from './controllers/appController.js';
import * as tokenMiddleware from './middlewares/tokenMiddleware.js'

dotenv.config({ path: "./dev.env" });
export const app = express();

app.use(methodOverride('_method'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
}));
app.use(fileUpload({
     limits: { fileSize: 50 * 1024 * 1024 },
     useTempFiles: true,
     tempFileDir: '/tmp/'
}));

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('../client'));

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY))
app.use(session({
     secret: process.env.SESSION_SECRET_KEY,
     cookie: { maxAge: 60000 },
     saveUninitialized: false,
     resave: false
}));

app.use(flash());
app.get('/', appController.getIndexPage)
app.use('/auth', authRoute);

app.get('/about', appController.getAboutPage)

app.use(tokenMiddleware.validateToken)
app.get('/docs', appController.getDocPage)
app.get('/plans', appController.getPlansPage)
app.use('/users', userRoute);
app.use('/pets', petRoute);

app.all("*", appController.pageNotFound404);

app.use(globalErrorHandler);