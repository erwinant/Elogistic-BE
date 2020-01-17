"use strict";
const fs = require("fs");
var fileName =
  __dirname +
  "/logs/" +
  new Date().getFullYear().toString() +
  (new Date().getMonth() + 1).toString() +
  ".log";
if (!fs.existsSync(fileName)) {
  try {
    fs.writeFile(fileName, "", { flag: "wx" }, function(err) {
      if (err) {
        console.error(err);
      } else {
        var log_file_err = fs.createWriteStream(fileName, {
          flags: "a"
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
} else {
  var log_file_err = fs.createWriteStream(fileName, {
    flags: "a"
  });
}

exports.ok = function(message, data, res) {
  var result = {
    status: true,
    message: message ? message : null,
    data: data ? data : null
  };
  res.json(result);
  res.end();
};

exports.ok2 = function(status, message, data, resStatus, res) {
  var result = {
    status: status,
    message: message,
    data: data
  };
  res.status(resStatus);
  res.json(result);
  res.end();
};

exports.error = function(message, data, res) {
  let result1 = data;
  if (data.sql) {
    result1 = data.original.message;
  }
  var result = {
    status: false,
    message: message,
    data: result1
  };

  log_file_err.write(
    new Date() +
      "\n === " +
      message +
      " === \n " +
      JSON.stringify(data) +
      "\n === End " +
      message +
      " ===" +
      "\n\n"
  );
  res.json(result);
  res.end();
};

exports.log_error = function(error) {
  log_file_err.write(
    new Date() +
      "\n === " +
      " === \n " +
      JSON.stringify(error) +
      "\n === End " +
      " ===" +
      "\n\n"
  );
};
