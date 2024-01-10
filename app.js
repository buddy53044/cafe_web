var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');

const cors = require('cors');
const TempCart = require('./models/temp_cart'); // 请根据实际路径修改
const Tempnote = require('./models/temp_note'); // 请根据实际路径修改
var app = express();
app.use(cors());


// 连接到MongoDB数据库
// mongoose.connect('mongodb://localhost:27017', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
mongoose.connect('mongodb+srv://user:8FFa5aXWuxKFevfR@cluster0.wpjo9te.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to the database');

    // 在连接数据库后清空 Temp_cart and Temp_note
    try {
      const Temp_cart_result = await TempCart.deleteMany({});
      const Temp_note_result = await Tempnote.deleteMany({});

      console.log('Temp_cart and Temp__note emptied');
    } catch (error) {
      console.error('清空 Temp_cart 内容时出现错误:', error.message);
    }
    
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const temp_cartRouter = require('./routes/temp_cart');
var contactRouter = require('./routes/contact');
var order_recordRouter = require('./routes/order_record');
var temp_noteRouter = require('./routes/temp_note');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 使用 session 中間件
app.use(session({
  secret: 'your-secret-key', // 用於加密 session 的密鑰，可以更換為更安全的值
  resave: false,
  saveUninitialized: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter); // post get sussessfully
app.use('/temp_cart', temp_cartRouter); //
app.use('/contact', contactRouter); // post get sussessfully
app.use('/order_record', order_recordRouter); // post get sussessfully
app.use('/temp_note', temp_noteRouter); // post get sussessfully


app.set('view engine', 'jade'); // 设置模板引擎为Jade
app.set('views', path.join(__dirname, 'views')); // 设置模板文件的目录


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





module.exports = app;



