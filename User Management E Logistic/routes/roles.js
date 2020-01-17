var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/roles");

// GET roles
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getRole, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List roles.", result, res);
        },
        error => {
          response.error("Error while get list roles.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list roles.", error, res);
  }
});

// POST roles
router.post("/", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addRole, {
        bind: [
          req.body.role_code,
          req.body.role_desc,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add role success.", result, res);
        },
        error => {
          response.error("Error while add role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add role.", error, res);
  }
});

// ACTIVATED
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateRole, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated role success.", result, res);
        },
        error => {
          response.error("Error while activated role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated role.", error, res);
  }
});

// DELETED
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteRole, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete role success.", result, res);
        },
        error => {
          response.error("Error while delete role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete role.", error, res);
  }
});

// UPDATE ROLE
router.post("/edit", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.updateRole, {
        bind: [req.body.role_desc, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update role success.", result, res);
        },
        error => {
          response.error("Error while updated role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated role.", error, res);
  }
});

// GET role job
router.get("/job/:roleId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getRoleJobByJobId, {
        bind: [req.params.roleId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List roles jobs.", result, res);
        },
        error => {
          response.error("Error while get list roles jobs.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list roles jobs.", error, res);
  }
});

// ADD Role Job
router.post("/job", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addRoleJob, {
        bind: [req.body.role_id, req.body.job_id, req.body.created_by, ipAddr],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Insert role job success.", result, res);
        },
        error => {
          response.error("Error while insert role job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while insert role job.", error, res);
  }
});

// ACTIVATED role job
router.post("/job/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateRoleJob, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated role job success.", result, res);
        },
        error => {
          response.error("Error while activated role job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated role job.", error, res);
  }
});

// DELETE role job
router.post("/job/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteRoleJob, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete role job success.", result, res);
        },
        error => {
          response.error("Error while delete role job.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete role job.", error, res);
  }
});

module.exports = router;
