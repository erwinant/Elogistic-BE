var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/jobs");

// GET jobs
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getJob, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List jobs.", result, res);
        },
        error => {
          response.error("Error while get list job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list job.", error, res);
  }
});

// POST jobs
router.post("/", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addJob, {
        bind: [
          req.body.job_code,
          req.body.job_desc,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add job success.", result, res);
        },
        error => {
          response.error("Error while add job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add job.", error, res);
  }
});

// ACTIVATE jobs
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateJob, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated job success.", result, res);
        },
        error => {
          response.error("Error while activated job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated job.", error, res);
  }
});

// DELETE jobs
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteJob, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete job success.", result, res);
        },
        error => {
          response.error("Error while delete job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete job.", error, res);
  }
});

// UPDATE jobs
router.post("/edit", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.updateJob, {
        bind: [req.body.job_desc, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update job success.", result, res);
        },
        error => {
          response.error("Error while updated job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated job.", error, res);
  }
});

// GET users jobs
router.get("/users/:jobId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getUserJobByJobId, {
        bind: [req.params.jobId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List users jobs.", result, res);
        },
        error => {
          response.error("Error while get list users jobs.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list users jobs.", error, res);
  }
});

// ADD user jobs
router.post("/user", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addUserJob, {
        bind: [req.body.user_id, req.body.job_id, req.body.created_by, ipAddr],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Insert user job success.", result, res);
        },
        error => {
          response.error("Error while insert user job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while insert user job.", error, res);
  }
});

// activated user job
router.post("/user/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateUserJob, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated user job success.", result, res);
        },
        error => {
          response.error("Error while activated user job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated user job.", error, res);
  }
});

//delete user job
router.post("/user/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteUserJob, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete user job success.", result, res);
        },
        error => {
          response.error("Error while delete user job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete user job.", error, res);
  }
});

module.exports = router;
