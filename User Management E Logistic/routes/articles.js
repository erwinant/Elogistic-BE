var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/articles");

// GET articles
router.get("/", function(req, res, next) {
  try {
    let sqlGetArticle =
      "SELECT a.id, a.title, a.description, CONCAT('" +
      process.env.BASE_URL +
      "/images/articles/" +
      "'," +
      "a.image) image, CASE WHEN a.application_id = 0 THEN 'ALL' ELSE app.application_name END application_name FROM articles a LEFT JOIN applications app on a.application_id = app.id WHERE a.is_active = 1 AND a.deleted = 0 AND a.start_date <= CAST(GETDATE() as date) AND a.end_date >= CAST(GETDATE() as date);";
    model.sequelize
      .query(sqlGetArticle, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List articles.", result, res);
        },
        error => {
          response.error("Error while get list articles.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list articles.", error, res);
  }
});

// GET articles by apps
router.get("/byApp/:applicationId", function(req, res, next) {
  try {
    let sqlGetArticleByAppId =
      "SELECT a.id, a.title, a.description, CONCAT('" +
      process.env.BASE_URL +
      "/images/articles/" +
      "'," +
      "a.image) image FROM articles a  WHERE a.is_active = 1 AND a.deleted = 0 AND a.start_date <= CAST(GETDATE() as date) AND a.end_date >= CAST(GETDATE() as date) AND (a.application_id = 0 OR a.application_id = $1);";
    model.sequelize
      .query(sqlGetArticleByAppId, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.params.applicationId]
      })
      .then(
        result => {
          response.ok("List articles.", result, res);
        },
        error => {
          response.error("Error while get list articles.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list articles.", error, res);
  }
});

// GET articles
router.get("/all", function(req, res, next) {
  try {
    let sqlGetAllArticle =
      "SELECT a.id, a.title, a.description, a.start_date, a.end_date, CONCAT('" +
      process.env.BASE_URL +
      "/images/articles/" +
      "'," +
      "a.image) image,a.is_active, a.application_id, CASE WHEN a.application_id = 0 THEN 'ALL' ELSE app.application_name END application_name FROM articles a LEFT JOIN applications app on a.application_id = app.id WHERE a.deleted = 0;";
    model.sequelize
      .query(sqlGetAllArticle, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List all articles.", result, res);
        },
        error => {
          response.error("Error while get list all articles.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list all articles.", error, res);
  }
});

// ADD articles
router.post("/", function(req, res, next) {
  try {
    let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    base64img = req.body.base64_url;
    imageName =
      req.body.created_by +
      "_" +
      new Date().getTime().toString() +
      "." +
      base64img.substr(
        base64img.indexOf("/") + 1,
        base64img.indexOf(";") - base64img.indexOf("/") - 1
      );
    model.sequelize
      .query(sql.addArticle, {
        type: model.sequelize.QueryTypes.INSERT,
        bind: [
          req.body.title,
          req.body.description,
          imageName,
          req.body.application_id,
          req.body.start_date,
          req.body.end_date,
          req.body.created_by,
          ipAddr
        ]
      })
      .then(
        result => {
          var body = req.body.base64_url,
            base64Data = body.substr(body.indexOf(",") + 1, body.length - 1),
            binaryData = new Buffer(base64Data, "base64").toString("binary");
          require("fs").writeFile(
            "./public/images/articles/" + imageName,
            binaryData,
            "binary",
            function(err) {
              console.log(err); // writes out file without error, but it's not a valid image
            }
          );
          response.ok("Add article success.", result, res);
        },
        error => {
          response.error("Error while add article.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add article.", error, res);
  }
});

// UPDATE articles
router.post("/update", function(req, res, next) {
  try {
    let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    let imageName;
    if (req.body.base64_url) {
      base64img = req.body.base64_url;
      imageName =
        req.body.updated_by +
        "_" +
        new Date().getTime().toString() +
        "." +
        base64img.substr(
          base64img.indexOf("/") + 1,
          base64img.indexOf(";") - base64img.indexOf("/") - 1
        );
    } else {
      imageName = req.body.image.substr(
        req.body.image.indexOf("articles/") + 9,
        req.body.image.length - 1
      );
    }

    model.sequelize
      .query(sql.updateArticle, {
        type: model.sequelize.QueryTypes.INSERT,
        bind: [
          req.body.title,
          req.body.description,
          imageName,
          req.body.application_id,
          req.body.start_date,
          req.body.end_date,
          req.body.updated_by,
          ipAddr,
          req.body.id
        ]
      })
      .then(
        result => {
          if (req.body.base64_url) {
            var body = req.body.base64_url,
              base64Data = body.substr(body.indexOf(",") + 1, body.length - 1),
              binaryData = new Buffer(base64Data, "base64").toString("binary");
            require("fs").writeFile(
              "./public/images/articles/" + imageName,
              binaryData,
              "binary",
              function(err) {
                console.log(err); // writes out file without error, but it's not a valid image
              }
            );
          }

          response.ok("Update article success.", result, res);
        },
        error => {
          response.error("Error while update article.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while update article.", error, res);
  }
});

//Activated
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activatedArticle, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated article success.", result, res);
        },
        error => {
          response.error("Error while activated article.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated article.", error, res);
  }
});

//Delete
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteArticle, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete article success.", result, res);
        },
        error => {
          response.error("Error while delete article.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete article.", error, res);
  }
});

module.exports = router;
