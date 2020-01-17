var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sqlProjects = require("../const/project");

/* GET Projects */
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlProjects.getProjects, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List project.", result, res);
        },
        error => {
          response.error("Error while get project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get project.", error, res);
  }
});
module.exports = router;
