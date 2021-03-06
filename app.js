var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
require("dotenv").config();
var cors = require('cors')
var app = express();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  });
// view engine setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin : "*"}))
var usersRouter = require("./routes/users.route");
app.use("/api/auth", usersRouter);

var productsRouter = require("./routes/products.route");
app.use("/api/products", productsRouter);

var categoryRouter = require("./routes/categories.route");
app.use("/api/categories", categoryRouter);

var orderRouter = require("./routes/orders.route");
app.use("/api/orders", orderRouter);

var bannerRouter = require("./routes/banners.route");
app.use("/api/banner", bannerRouter);

var blogRouter = require("./routes/blogs.route");
app.use("/api/blogs", blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
