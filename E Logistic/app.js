var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var areasRouter = require("./routes/areas");
var projectsRouter = require("./routes/projects");
var zonesRouter = require("./routes/zones");
var ordersRouter = require("./routes/orders");
var materialsRouter = require("./routes/materials");
var schedulersRouter = require("./routes/scheduler");
var kafkaConsumersRouter = require("./routes/kafkaConsumers");
var jwt = require("jsonwebtoken");
var SECRET_KEY_JWT_EL = "4CS3T!Nd0NuS4";
var response = require("./response");

var cors = require("cors");

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

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
    req.path.includes("schedulers")
  ) {
    next();
  } else {
    jwt.verify(req.headers["authorization"], SECRET_KEY_JWT_EL, function(
      err,
      decoded
    ) {
      if (err) {
        res.status(401);
        response.error("Your session has been expired!", err, res);
      } else {
        next();
      }
    });
  }
};

app.use(allRequest);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/areas", areasRouter);
app.use("/projects", projectsRouter);
app.use("/zones", zonesRouter);
app.use("/orders", ordersRouter);
app.use("/materials", materialsRouter);
app.use("/schedulers", schedulersRouter);
app.use("/kafkaConsumers", kafkaConsumersRouter);

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
