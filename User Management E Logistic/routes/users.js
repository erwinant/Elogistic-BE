var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var jwt = require("jsonwebtoken");
var SECRET_KEY_JWT_UM = "4CS3T!Nd0NuS4";
var nodemailer = require("nodemailer");
var FCM = require("fcm-node");
var serverKey =
  "AAAAFPglOLU:APA91bE-dXyDZ8X_nrBYSvXMgcCrFa6ljJCnhwVX6XKVXP2EmSd7N48GmxcckdUSSEow8fe-JNwSWdPR7nwbXC7Fl-VQP8ayHxNlzNswSwoZsizaxC0UU6E74riRZBBg6NwRU1m_XDoe"; // put your server key here
var fcm = new FCM(serverKey);
var application_id = process.env.APP_ID || 6;
var sql = require("../const/users");
var ccMail = "lutfi.ardiansyah@acset.co";

// LOGIN
router.post("/login", function(req, res, next) {
  let dataLogin = {
    profileUser: null,
    profileJob: null,
    profileRole: null,
    profileMenu: null,
    profilePlant: null,
    profileZone: null,
    profileArea: null,
    token: null
  };
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!req.body.username) {
    response.error("Username cannot be empty!", [], res);
  }
  if (!req.body.password) {
    response.error("Password cannot be empty!", [], res);
  }
  if (!req.body.application_id) {
    response.error("Application cannot be empty!", [], res);
  }
  try {
    model.sequelize
      .query(sql.checkUserRegis, {
        bind: [req.body.username],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          if (result[0].count_user == 0) {
            response.error("Username not registered.", [], res);
          } else {
            model.sequelize
              .query(
                sql.deleteUsersExpiredToken + sql.checkUserLoginAnotherDevice,
                {
                  bind: [req.body.username, req.body.application_id, 4],
                  type: model.sequelize.QueryTypes.SELECT
                }
              )
              .then(
                checkUser => {
                  if (checkUser[0].loggedIn > 0) {
                    response.error(
                      "Your account is still logged in on another device.",
                      [],
                      res
                    );
                  } else {
                    model.sequelize
                      .query(sql.profileUser, {
                        bind: [req.body.username, req.body.password],
                        type: model.sequelize.QueryTypes.SELECT
                      })
                      .then(result2 => {
                        if (result2.length == 0) {
                          model.sequelize
                            .query(sql.updateWronggPassAndBlockAfter3XWrong, {
                              bind: [req.body.username],
                              type: model.sequelize.QueryTypes.UPDATE
                            })
                            .then(updatePass => {
                              response.error(
                                "Your password is incorrect.",
                                [],
                                res
                              );
                            });
                        } else {
                          dataLogin.profileUser = result2;
                          dataLogin.token = jwt.sign(
                            {
                              data: dataLogin.profileUser
                            },
                            SECRET_KEY_JWT_UM,
                            {
                              expiresIn: "4h"
                            }
                          );
                          model.sequelize
                            .query(sql.profileJob, {
                              bind: [req.body.username, req.body.password],
                              type: model.sequelize.QueryTypes.SELECT
                            })
                            .then(
                              result3 => {
                                model.sequelize
                                  .query(
                                    sql.resetCountWrongPassAfterLoginSuccess,
                                    {
                                      bind: [req.body.username],
                                      type: model.sequelize.QueryTypes.UPDATE
                                    }
                                  )
                                  .then(resetWrongPass => {
                                    dataLogin.profileJob = result3;
                                    model.sequelize
                                      .query(sql.profileRole, {
                                        bind: [
                                          req.body.username,
                                          req.body.password
                                        ],
                                        type: model.sequelize.QueryTypes.SELECT
                                      })
                                      .then(
                                        result4 => {
                                          dataLogin.profileRole = result4;
                                          model.sequelize
                                            .query(sql.profileMenu, {
                                              bind: [
                                                req.body.username,
                                                req.body.password,
                                                req.body.application_id
                                              ],
                                              type:
                                                model.sequelize.QueryTypes
                                                  .SELECT
                                            })
                                            .then(
                                              result5 => {
                                                dataLogin.profileMenu = result5;
                                                // user project
                                                model.sequelize
                                                  .query(sql.profilePlant, {
                                                    bind: [req.body.username],
                                                    type:
                                                      model.sequelize.QueryTypes
                                                        .SELECT
                                                  })
                                                  .then(
                                                    userProject => {
                                                      dataLogin.profilePlant = userProject;
                                                      // user zone
                                                      model.sequelize
                                                        .query(
                                                          sql.profileZone,
                                                          {
                                                            bind: [
                                                              req.body.username
                                                            ],
                                                            type:
                                                              model.sequelize
                                                                .QueryTypes
                                                                .SELECT
                                                          }
                                                        )
                                                        .then(
                                                          userZone => {
                                                            dataLogin.profileZone = userZone;
                                                            model.sequelize
                                                              .query(
                                                                sql.historyLogin,
                                                                {
                                                                  bind: [
                                                                    result2[0]
                                                                      .id,
                                                                    req.body
                                                                      .application_id,
                                                                    ipAddr
                                                                  ],
                                                                  type:
                                                                    model
                                                                      .sequelize
                                                                      .QueryTypes
                                                                      .INSERT
                                                                }
                                                              )
                                                              .then(
                                                                result6 => {
                                                                  model.sequelize
                                                                    .query(
                                                                      sql.deleteUserLogin,
                                                                      {
                                                                        bind: [
                                                                          result2[0]
                                                                            .id,
                                                                          req
                                                                            .body
                                                                            .application_id
                                                                        ],
                                                                        type:
                                                                          model
                                                                            .sequelize
                                                                            .QueryTypes
                                                                            .DELETE
                                                                      }
                                                                    )
                                                                    .then(
                                                                      result7 => {
                                                                        model.sequelize
                                                                          .query(
                                                                            sql.insertUserLogin,
                                                                            {
                                                                              bind: [
                                                                                result2[0]
                                                                                  .id,
                                                                                req
                                                                                  .body
                                                                                  .application_id,
                                                                                dataLogin.token,
                                                                                req
                                                                                  .body
                                                                                  .token_fcm,
                                                                                req
                                                                                  .body
                                                                                  .username,
                                                                                result2[0]
                                                                                  .email,
                                                                                ipAddr
                                                                              ],
                                                                              type:
                                                                                model
                                                                                  .sequelize
                                                                                  .QueryTypes
                                                                                  .INSERT
                                                                            }
                                                                          )
                                                                          .then(
                                                                            result8 => {
                                                                              model.sequelize
                                                                                .query(
                                                                                  sql.profileArea,
                                                                                  {
                                                                                    type:
                                                                                      model
                                                                                        .sequelize
                                                                                        .QueryTypes
                                                                                        .SELECT,
                                                                                    bind: [
                                                                                      req
                                                                                        .body
                                                                                        .username
                                                                                    ]
                                                                                  }
                                                                                )
                                                                                .then(
                                                                                  userArea => {
                                                                                    dataLogin.profileArea = userArea;
                                                                                    response.ok(
                                                                                      "Login success",
                                                                                      dataLogin,
                                                                                      res
                                                                                    );
                                                                                  },
                                                                                  error => {
                                                                                    response.error(
                                                                                      "Error while get list area in this user.",
                                                                                      error,
                                                                                      res
                                                                                    );
                                                                                  }
                                                                                );
                                                                            },
                                                                            error => {
                                                                              response.error(
                                                                                "Error while insert users_login.",
                                                                                error,
                                                                                res
                                                                              );
                                                                            }
                                                                          );
                                                                      },
                                                                      error => {
                                                                        response.error(
                                                                          "Error while clean user login.",
                                                                          error,
                                                                          res
                                                                        );
                                                                      }
                                                                    );
                                                                },
                                                                error => {
                                                                  response.error(
                                                                    "Error while insert history_login.",
                                                                    error,
                                                                    res
                                                                  );
                                                                }
                                                              );
                                                          },
                                                          error => {
                                                            response.error(
                                                              "Error while get users zone.",
                                                              error,
                                                              res
                                                            );
                                                          }
                                                        );
                                                      // end user zone
                                                    },
                                                    error => {
                                                      response.error(
                                                        "Error while insert users_login.",
                                                        error,
                                                        res
                                                      );
                                                    }
                                                  );
                                                // end user project
                                              },
                                              error => {
                                                response.error(
                                                  "Error while get profile menu.",
                                                  error,
                                                  res
                                                );
                                              }
                                            );
                                        },
                                        error => {
                                          response.error(
                                            "Error while get profile role.",
                                            error,
                                            res
                                          );
                                        }
                                      );
                                  });
                              },
                              error => {
                                response.error(
                                  "Error while get profile job.",
                                  error,
                                  res
                                );
                              }
                            );
                        }
                      });
                  }
                },
                error => {
                  response.error("Error while login.", error, res);
                }
              );
          }
        },
        error => {
          response.error("Error while find user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while login.", error, res);
  }
});

/* GET users listing. */
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getUsers, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List users.", result, res);
        },
        error => {
          response.error("Error while get list user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list user.", error, res);
  }
});

// GET Detail User
router.get("/:userId", function(req, res, next) {
  try {
    let userDetail = {
      jobs: null,
      projects: null,
      zones: null,
      areas: null
    };
    model.sequelize
      .query(sql.getDetailUserJob, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.params.userId]
      })
      .then(result => {
        userDetail.jobs = result;
        model.sequelize
          .query(sql.getDetailUserProject, {
            type: model.sequelize.QueryTypes.SELECT,
            bind: [req.params.userId]
          })
          .then(result => {
            userDetail.projects = result;
            model.sequelize
              .query(sql.getDetailUserProjectZone, {
                type: model.sequelize.QueryTypes.SELECT,
                bind: [req.params.userId]
              })
              .then(result => {
                userDetail.zones = result;
                model.sequelize
                  .query(sql.getDetailUserProjectZoneArea, {
                    type: model.sequelize.QueryTypes.SELECT,
                    bind: [req.params.userId]
                  })
                  .then(result => {
                    userDetail.areas = result;
                    response.ok("Detail user.", userDetail, res);
                  })
                  .catch(error => {
                    response.error(
                      "Error while get detail user areas!",
                      error,
                      res
                    );
                  });
              })
              .catch(error => {
                response.error(
                  "Error while get detail user zones!",
                  error,
                  res
                );
              });
          })
          .catch(error => {
            response.error("Error while get detail user projects!", error, res);
          });
      })
      .catch(error => {
        response.error("Error while get detail user jobs!", error, res);
      });
  } catch (error) {
    response.error("Error while get detail user!", error, res);
  }
});

// POST users
router.post("/", function(req, res, next) {
  let transporter = nodemailer.createTransport({
    host: "mail.acset.co",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "notification-master@acset.co",
      pass: "Vfr45tgB$%"
    }
  });
  try {
    model.sequelize
      .query(sql.addUser, {
        bind: [
          req.body.username,
          req.body.full_name,
          req.body.gender,
          req.body.email,
          req.body.no_handphone,
          req.body.password,
          req.body.created_by,
          req.headers["x-forwarded-for"] || req.connection.remoteAddress
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          transporter.sendMail({
            from: '"[NO-REPLY] ACSET" <notification-master@acset.co>', // sender address
            to: req.body.email, // list of receivers
            subject: "[REGISTRATION SUCCESS]", // Subject line
            text: "User Login", // plain text body
            html:
              "<p>Kepada Yth,</p> <p><b>" +
              req.body.full_name +
              "</b></p> <br/> <p>Bersama ini kami kirimkan username & password Anda.</p> <p align='center'><b>USERNAME: " +
              req.body.username +
              "</b></p><p align='center'><b>PASSWORD: " +
              req.body.password +
              "</b></p> <p>Password yang dikirimkan ini dihasilkan oleh sistem dan bersifat rahasia, jaga baik-baik agar tidak diketahui orang lain.</p> <br/> <p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>" // html body
          });
          response.ok("Add users success.", result, res);
        },
        error => {
          response.error("Error while add user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add user.", error, res);
  }
});

// Logout
router.post("/logout", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.logout, {
        bind: [req.body.id, req.body.application_id],
        type: model.sequelize.QueryTypes.DELETE
      })
      .then(
        result => {
          response.ok("Logout success.", [], res);
        },
        error => {
          response.error("Error while logout.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add user.", error, res);
  }
});

//Activated
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateUser, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated user success.", result, res);
        },
        error => {
          response.error("Error while activated user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated user.", error, res);
  }
});

//Delete
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteUser, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete user success.", result, res);
        },
        error => {
          response.error("Error while delete user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete user.", error, res);
  }
});

//Update user
router.post("/edit", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.updateUser, {
        bind: [
          req.body.full_name,
          req.body.gender,
          req.body.email,
          req.body.no_handphone,
          req.body.updated_by,
          ipAddr,
          req.body.id
        ],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update user success.", result, res);
        },
        error => {
          response.error("Error while updated user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated user.", error, res);
  }
});

//change password
router.post("/changePassword", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.changePass, {
        bind: [req.body.updated_by, ipAddr, req.body.password, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Change password success.", result, res);
        },
        error => {
          response.error("Error while change password.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while change password.", error, res);
  }
});

// Get User Project
router.post("/project", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getUserProject, {
        bind: [req.body.plant_code],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List user project.", result, res);
        },
        error => {
          response.error("Error while get list user project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list user project.", error, res);
  }
});

// activated user project
router.post("/project/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateUserProject, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated user project success.", result, res);
        },
        error => {
          response.error("Error while activated user project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated user project.", error, res);
  }
});

//delete user project
router.post("/project/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteUserProject, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete user project success.", result, res);
        },
        error => {
          response.error("Error while delete user project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete user project.", error, res);
  }
});

router.post("/project/add", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addUserProject, {
        bind: [
          req.body.user_id,
          req.body.plant_code,
          req.body.project_name,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Insert user project success.", result, res);
        },
        error => {
          response.error("Error while insert user project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while insert user project.", error, res);
  }
});

//Get List User Project Zone
router.post("/project/zone", function(req, res, next) {
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.getUserProjectZone, {
        bind: [req.body.plant_code, req.body.zone_id],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List User Project Zone.", result, res);
        },
        error => {
          response.error("Error while get List User Project Zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get List User Project Zone.", error, res);
  }
});

// Add user project zone
router.post("/project/zone/add", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.addUserProjectZone, {
        bind: [
          req.body.plant_code,
          req.body.zone_id,
          req.body.user_id,
          req.body.created_by,
          req.headers["x-forwarded-for"] || req.connection.remoteAddress
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add user project zone success.", result, res);
        },
        error => {
          response.error("Error while add user project zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add user project zone.", error, res);
  }
});

// activated user project zone
router.post("/project/zone/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateUserProjectZone, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated user project success.", result, res);
        },
        error => {
          response.error("Error while activated user project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated user project.", error, res);
  }
});

//delete user project zone
router.post("/project/zone/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteUserProjectZone, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete user project success.", result, res);
        },
        error => {
          response.error("Error while delete user project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete user project.", error, res);
  }
});

//send push notification
router.post("/sendNotifications", function(req, res, next) {
  try {
    var message = {
      registration_ids: req.body.tokenFcm,
      collapse_key: "2",

      notification: req.body.notification
    };

    fcm.send(message, function(err, result) {
      if (err) {
        response.error("Error while send push notification!", err, res);
      } else {
        response.ok("Push notifications success.", JSON.parse(result), res);
      }
    });
  } catch (error) {
    response.error("Error while send notifications", error, res);
  }
});

//send push notification new order
router.post("/sendNotificationsNewOrder", function(req, res, next) {
  try {
    let roleCode = "SM_EL";
    model.sequelize
      .query(sql.getSMForPushNotifNewOrder, {
        bind: [
          application_id,
          req.body.plant_code,
          req.body.zone_id,
          req.body.area_id,
          roleCode
        ],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          let tokenFcm = [];
          result.forEach(element => {
            tokenFcm.push(element.token_fcm);
          });
          var message = {
            registration_ids: tokenFcm,
            collapse_key: "2",

            notification: {
              title: "E-Logistic",
              body: "New Request waiting approval!",
              icon: process.env.BASE_URL + "/images/logo-acset.png",
              click_action: req.body.click_action
            }
          };

          model.sequelize
            .query(sql.getEmailSMForNotifEmail, {
              type: model.sequelize.QueryTypes.SELECT,
              bind: [
                req.body.plant_code,
                req.body.zone_id,
                req.body.area_id,
                roleCode
              ]
            })
            .then(result2 => {
              let to = "";
              result2.forEach(element => {
                to = to + element.email + ",";
              });
              let html =
                "<p>Kepada Yth,</p> <p><b> Site Manager </b></p><br/>" +
                " <p>Bersama ini kami beritahukan terdapat 1 order menunggu untuk di approve. Klik pada tautan berikut : </p> <a href='" +
                req.body.click_action +
                "'>Klik Disini!</a> <br/> <br/><p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>";
              sendEmail(
                to,
                "[E-Logistic] Approval Order",
                "New Request waiting approval!",
                html
              );

              fcm.send(message, function(err, resultFcm) {
                if (err) {
                  response.error(
                    "Error while send push notification!",
                    err,
                    res
                  );
                } else {
                  response.ok(
                    "Push notifications success.",
                    JSON.parse(resultFcm),
                    res
                  );
                }
              });
            })
            .catch(errorEmail => {
              response.error(
                "Error while send notifications.",
                errorEmail,
                res
              );
            });
        },
        error => {
          response.error("Error while send notifications.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while send notifications", error, res);
  }
});

//send push notification approve
router.post("/sendNotificationsApprove", function(req, res, next) {
  try {
    let roleCode = "ADM_LGTK";
    model.sequelize
      .query(sql.getALForPushNotifApprove, {
        bind: [req.body.plant_code, application_id, roleCode],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          let tokenFcm = [];
          result.forEach(element => {
            tokenFcm.push(element.token_fcm);
          });
          var message = {
            registration_ids: tokenFcm,
            collapse_key: "2",

            notification: {
              title: "E-Logistic",
              body: "New Request waiting packing order!",
              icon: process.env.BASE_URL + "/images/logo-acset.png",
              click_action: req.body.click_action
            }
          };
          model.sequelize
            .query(sql.getEmailALForNotifEmail, {
              type: model.sequelize.QueryTypes.SELECT,
              bind: [req.body.plant_code, roleCode]
            })
            .then(result2 => {
              let to = "";
              result2.forEach(element => {
                to = to + element.email + ",";
              });
              let html =
                "<p>Kepada Yth,</p> <p><b> Admin Logistic </b></p><br/>" +
                " <p>Bersama ini kami beritahukan terdapat 1 order menunggu untuk di packing. Klik pada tautan berikut : </p> <a href='" +
                req.body.click_action +
                "'>Klik Disini!</a> <br/> <br/><p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>";
              sendEmail(
                to,
                "[E-Logistic] Packing Order",
                "Approved Order!",
                html
              );

              fcm.send(message, function(err, resultFcm) {
                if (err) {
                  response.error(
                    "Error while send push notification!",
                    err,
                    res
                  );
                } else {
                  response.ok(
                    "Push notifications success.",
                    JSON.parse(resultFcm),
                    res
                  );
                }
              });
            })
            .catch(errorEmail => {
              response.error(
                "Error while send notifications.",
                errorEmail,
                res
              );
            });
        },
        error => {
          response.error("Error while get list roles.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while send notifications", error, res);
  }
});

//send push notification delivery
router.post("/sendNotificationsDelivery", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getSPVForPushNotifDelivery, {
        bind: [application_id, req.body.created_by],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          let tokenFcm = [];
          result.forEach(element => {
            tokenFcm.push(element.token_fcm);
          });
          var message = {
            registration_ids: tokenFcm,
            collapse_key: "2",

            notification: {
              title: "E-Logistic",
              body:
                "Request " +
                req.body.order_no +
                " in shipping, please recieve order after material arrived!",
              icon: process.env.BASE_URL + "/images/logo-acset.png",
              click_action: req.body.click_action
            }
          };

          model.sequelize
            .query(sql.getEmailSPVForNotifEmail, {
              type: model.sequelize.QueryTypes.SELECT,
              bind: [req.body.created_by]
            })
            .then(result2 => {
              let to = "";
              result2.forEach(element => {
                to = to + element.email + ",";
              });
              let html =
                "<p>Kepada Yth,</p> <p><b> Supervisor Project </b></p><br/>" +
                " <p>Bersama ini kami beritahukan Request " +
                req.body.order_no +
                " anda sedang dikirim. Klik pada tautan berikut untuk melihat detail : </p> <a href='" +
                req.body.click_action +
                "'>Klik Disini!</a> <br/> <br/><p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>";
              sendEmail(
                to,
                "[E-Logistic]",
                "Delivery Order!",
                html
              );

              fcm.send(message, function(err, resultFcm) {
                if (err) {
                  response.error(
                    "Error while send push notification!",
                    err,
                    res
                  );
                } else {
                  response.ok(
                    "Push notifications success.",
                    JSON.parse(resultFcm),
                    res
                  );
                }
              });
            })
            .catch(errorEmail => {
              response.error(
                "Error while send notifications.",
                errorEmail,
                res
              );
            });
        },
        error => {
          response.error("Error while get list roles.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while send notifications", error, res);
  }
});

//Get Detail User
router.post("/detail", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getDetailUserByUsername, {
        bind: [req.body.username],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("Detail user.", result, res);
        },
        error => {
          response.error("Error while get detail user.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get detail user.", error, res);
  }
});

/* GET list active login apps by user id. */
router.get("/loginApps/:userId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getListUserLoginApps, {
        bind: [req.params.userId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List active login apps by user id.", result, res);
        },
        error => {
          response.error(
            "Error while get list active login apps by user id.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while get list active login apps by user id.",
      error,
      res
    );
  }
});

/* Logout users from apps. */
router.delete("/logout/:loginId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.logoutUserFromApp, {
        bind: [req.params.loginId],
        type: model.sequelize.QueryTypes.DELETE
      })
      .then(
        result => {
          response.ok("Logout success!.", result, res);
        },
        error => {
          response.error("Error while logout users from app.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while logout users from app2.", error, res);
  }
});

// Get User From Project in zone in area
router.post("/project/zone/area", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getUserProjectZoneArea, {
        bind: [req.body.plant_code, req.body.zone_id, req.body.area_id],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List users from projet in zone and area.", result, res);
        },
        error => {
          response.error(
            "Error while get users from projet in zone and area.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while get users from projet in zone and area.",
      error,
      res
    );
  }
});

// Add User to Project in zone and area
router.post("/project/zone/area/add", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addUserProjectZoneArea, {
        bind: [
          req.body.plant_code,
          req.body.zone_id,
          req.body.area_id,
          req.body.user_id,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok(
            "Add User to Project in zone and area sukses!.",
            result,
            res
          );
        },
        error => {
          response.error(
            "Error while get users from projet in zone and area.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while add user from projet in zone and area.",
      error,
      res
    );
  }
});

// Active or Deactive User in Project,zone and area
router.post("/project/zone/area/active", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateUserProjectZoneArea, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok(
            "Active / Deactive User in Project, zone and area success!.",
            result,
            res
          );
        },
        error => {
          response.error(
            "Error while active/deactive user in projet,zone and area.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while active/deactive user in projet,zone and area.",
      error,
      res
    );
  }
});

// Delete User in Project,zone and area
router.post("/project/zone/area/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteUserProjectZoneArea, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok(
            "Delete User in Project, zone and area sukses!.",
            result,
            res
          );
        },
        error => {
          response.error(
            "Error while delete user in projet,zone and area.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while delete user in projet,zone and area.",
      error,
      res
    );
  }
});

router.post("/sendNotifToRequestor", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getSPVForPushNotifRequestor, {
        bind: [req.body.application_id, req.body.username],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          let tokenFcm = [];
          result.forEach(element => {
            tokenFcm.push(element.token_fcm);
          });
          model.sequelize
            .query(sql.getEmailSPVForNotifEmail, {
              type: model.sequelize.QueryTypes.SELECT,
              bind: [req.body.username]
            })
            .then(result2 => {
              let to = "";
              result2.forEach(element => {
                to = to + element.email + ",";
              });
              let html =
                "<p>Kepada Yth,</p> <p><b> " +
                req.body.username +
                " </b></p><br/>" +
                " <p>Bersama ini kami beritahukan " +
                req.body.notification.body +
                " . Klik pada tautan berikut untuk melihat detail : </p> <a href='" +
                req.body.notification.click_action +
                "'>Klik Disini!</a> <br/> <br/><p>Terima Kasih,</p> <p>PT. ACSET Indonusa TBK.</p>";
              sendEmail(
                to,
                "[E-Logistic]",
                "Order Info!",
                html
              );

              sendNotifications(tokenFcm, req.body.notification).then(
                pushNotif => {
                  response.ok("Push notifications success.", pushNotif, res);
                },
                error => {
                  response.error("Error while send notifications", error, res);
                }
              );
            })
            .catch(errorEmail => {
              response.error(
                "Error while send notifications.",
                errorEmail,
                res
              );
            });
        },
        error => {
          response.error("Error while send notifications", error, res);
        }
      );
  } catch (error) {
    response.error("Error while send notifications", error, res);
  }
});

async function sendNotifications(tokenFcm, notification) {
  try {
    var message = {
      registration_ids: tokenFcm,
      collapse_key: "2",

      notification: notification
    };

    fcm.send(message, function(err, result) {
      if (err) {
        return err;
      } else {
        return true;
      }
    });
  } catch (error) {
    return error;
  }
}

async function sendEmail(to, subject, text, html) {
  let transporter = nodemailer.createTransport({
    host: "mail.acset.co",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "notification-master@acset.co",
      pass: "Vfr45tgB$%"
    }
  });

  let info = await transporter.sendMail({
    from: '"[NO-REPLY] ACSET" <notification-master@acset.co>', // sender address
    to: to, // list of receivers
    cc: ccMail,
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = router;
