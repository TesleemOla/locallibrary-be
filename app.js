import createError from 'http-errors';
import express from 'express';
import path, { dirname } from "path";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import indexRouter from "./routes/index.js"
import usersRouter from "./routes/users.js"
import catalogRouter from "./routes/catalog.js"
import main from "./db/connectmongo.js"
import { fileURLToPath } from 'url';




// process.env.TOKEN=crypto.randomBytes(64).toString('hex')
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// connect to db

main()

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log(`server now started on port ${PORT}`);
})

export default app;
