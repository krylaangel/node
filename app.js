const createError = require("http-errors");
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const themeRouter = require("./routes/theme");
const authRouter = require("./routes/authJwt");
const protectedRouter = require("./routes/protected/protectedJWT");
const chalk = require("chalk");
const morgan = require("morgan");
const session = require("express-session");
const authenticateJWT = require("./routes/middleware/authMiddleware");
const dashboardRouter = require("./routes/dashboard");
const connectDB = require("./connect");
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
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/theme", themeRouter);
app.use("/dashboard", dashboardRouter);

// auth routes
app.use("/auth_jwt", authRouter);

// protected routes
app.use("/secure_jwt", authenticateJWT, protectedRouter);

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
