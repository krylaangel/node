require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const chalk = require("chalk");
const morgan = require("morgan");
const session = require("express-session");
const connectDB = require("./connect");
const cors = require("cors");

const app = express();
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
})();
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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 },
  }),
);

// public routes
app.use("/", indexRouter);

// auth routes
app.use("/api", authRouter);

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
