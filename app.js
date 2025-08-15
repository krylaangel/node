const createError = require("http-errors");
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug")("myapp:server");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const themeRouter = require("./routes/theme");
const authRouter = require("./routes/auth");
const protectedRouter = require("./routes/protected");
const chalk = require("chalk");
const morgan = require("morgan");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// EJS — окреме налаштування
app.engine("ejs", require("ejs").__express);
// app.set("view engine", "ejs");

app.use(
  morgan(function (tokens, req, res) {
    const method = chalk.cyan(tokens.method(req, res));
    const url = chalk.green(tokens.url(req, res));
    const status = tokens.status(req, res);
    const statusColor =
      status >= 500 ? chalk.red : status >= 400 ? chalk.yellow : chalk.green;
    const responseTime = chalk.magenta(
      tokens["response-time"](req, res) + " ms",
    );

    return [method, url, statusColor(status), responseTime].join(" ");
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/theme", themeRouter);
app.use("/auth", authRouter);
app.use("/secure", protectedRouter);

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
  res.render("error");
});

module.exports = app;
