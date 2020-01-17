var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var jobsRouter = require("./routes/jobs");
var rolesRouter = require("./routes/roles");
var applicationsRouter = require("./routes/applications");
var articlesRouter = require("./routes/articles");
var kafkaProducersRouter = require("./routes/kafkaProducers");
var resetPasswordsRouter = require("./routes/reset-password");
var jwt = require("jsonwebtoken");
var SECRET_KEY_JWT_UM = "4CS3T!Nd0NuS4";

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

var allRequest = function(req, res, next) {
  if (
    req.path == "/users/login" ||
    req.path == "/users/logout" ||
    req.path == "/users/testSendEmail" ||
    req.path.includes("reset_password") ||
    req.path.includes("images")
  ) {
    next();
  } else {
    jwt.verify(req.headers["authorization"], SECRET_KEY_JWT_UM, function(
      err,
      decoded
    ) {
      if (err) {
        res.status(401);
        res.end();
      } else {
        next();
      }
    });
  }
};

app.use(allRequest);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/roles", rolesRouter);
app.use("/applications", applicationsRouter);
app.use("/articles", articlesRouter);
app.use("/kafkaProducers", kafkaProducersRouter);
app.use("/reset_password", resetPasswordsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
