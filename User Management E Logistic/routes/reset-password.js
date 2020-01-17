"use strict";
var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/reset-password");
var md5 = require("md5");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "mail.acset.co",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "notification-master@acset.co",
    pass: "Vfr45tgB$%"
  }
});

router.post("/", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!req.body.email) {
    response.error("Parameter not valid!", [], res);
    return;
  }
  model.sequelize
    .query(sql.validateEmail, {
      type: model.sequelize.QueryTypes.SELECT,
      bind: [req.body.email]
    })
    .then(validateEmail => {
      if (validateEmail[0].count_email == 0) {
        response.error("E-mail not registered!", [], res);
      } else {
        let token = md5(req.body.email + new Date().getTime().toString());
        model.sequelize
          .query(sql.removeExistEmail + sql.insertIntoResetPassword, {
            bind: [req.body.email, token, ipAddr]
          })
          .then(result => {
            transporter.sendMail({
              from: '"[NO-REPLY] ACSET" <notification-master@acset.co>', // sender address
              to: req.body.email, // list of receivers
              subject: "[RESET PASSWORD]", // Subject line
              text: "Link Reset Password", // plain text body
              html:
                "<p>Kepada Yth,</p> <p><b>" +
                req.body.email +
                "</b></p> <br/> <p>Bersama ini kami kirimkan tautan untuk reset password.</p> <p align='center'><a href='" +
                process.env.BASE_URL +
                "/reset_password/" +
                token +
                "'>" +
                process.env.BASE_URL +
                "/reset_password/" +
                token +
                "</a></p> <p>Tautan yang dikirimkan ini dihasilkan oleh sistem dan bersifat rahasia, jaga baik-baik agar tidak diketahui orang lain. Tautan akan kadaluarsa dalam 1 jam kedepan.</p> <br/> <p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>" // html body
            });
            response.ok(
              "Please cheak email, link has been sent to email.",
              result,
              res
            );
          })
          .catch(error => {
            response.error(
              "Error while Insert Into Reset Password!",
              error,
              res
            );
          });
      }
    })
    .catch(error => {
      response.error("Error while validate email!", error, res);
    });
});

router.get("/:token", function(req, res, next) {
  if (!req.params.token) {
    res.render("index", {
      title: "API User Management",
      message: "Welcome to API User Management!"
    });
    return;
  }
  model.sequelize
    .query(sql.removeExpiredResetPassword + sql.checkTokenResetPassword, {
      bind: [req.params.token]
    })
    .then(result => {
      if (result[0][0].token == 0) {
        res.render("index", {
          title: "Reset Password",
          message: "Invalid link / link reset password has been expired!"
        });
      } else {
        let newPassword = generateRandomPassword();
        model.sequelize
          .query(sql.resetPassword, {
            bind: [newPassword, req.params.token]
          })
          .then(result => {
            model.sequelize
              .query(sql.getDetailUser + sql.deleteToken, {
                type: model.sequelize.QueryTypes.SELECT,
                bind: [req.params.token]
              })
              .then(detailUser => {
                console.log(detailUser);
                transporter.sendMail({
                  from: '"[NO-REPLY] ACSET" <notification-master@acset.co>', // sender address
                  to: detailUser[0].email, // list of receivers
                  subject: "[RESET PASSWORD]", // Subject line
                  text: "New Password", // plain text body
                  html:
                    "<p>Kepada Yth,</p> <p><b>" +
                    detailUser[0].full_name +
                    "</b></p> <br/> <p>Bersama ini kami kirimkan username & password baru Anda.</p> <p align='center'><b>USERNAME: " +
                    detailUser[0].username +
                    "</b></p><p align='center'><b>NEW PASSWORD: " +
                    newPassword +
                    "</b></p> <p>Password yang dikirimkan ini dihasilkan oleh sistem dan bersifat rahasia, jaga baik-baik agar tidak diketahui orang lain.</p> <br/> <p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>" // html body
                });
                res.render("index", {
                  title: "Reset Password Success!",
                  message:
                    "Please cheak email, new password been sent to email."
                });
              })
              .catch(error => {
                response.error("Error while get Detail User", error, res);
              });
          })
          .catch(error => {
            response.error("Error while Reset Password", error, res);
          });
      }
    })
    .catch(error => {
      response.error("Error while Reset Password", error, res);
    });
});

function generateRandomPassword() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
