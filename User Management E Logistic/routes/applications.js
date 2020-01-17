var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/applications");

// GET applications
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getApplication, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List applications.", result, res);
        },
        error => {
          response.error("Error while get list applications.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list applications.", error, res);
  }
});

// POST application
router.post("/", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addApplication, {
        bind: [req.body.application_name, 1, req.body.created_by, ipAddr],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add application success.", result, res);
        },
        error => {
          response.error("Error while add application.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add application.", error, res);
  }
});

//UPDATE Application
router.post("/edit", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.updateApplication, {
        bind: [
          req.body.application_name,
          req.body.updated_by,
          ipAddr,
          req.body.id
        ],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update application success.", result, res);
        },
        error => {
          response.error("Error while updated application.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated application.", error, res);
  }
});

// GET menu by application id
router.get("/:applicationId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getApplicationById, {
        bind: [req.params.applicationId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List application menu.", result, res);
        },
        error => {
          response.error("Error while get list application menu.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list application menu.", error, res);
  }
});

// POST add menu
router.post("/addMenu", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addApplicationMenu, {
        bind: [
          req.body.application_name,
          2,
          req.body.parent_id,
          req.body.application_id,
          req.body.route,
          req.body.icon,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add menu success.", result, res);
        },
        error => {
          response.error("Error while add menu.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add menu.", error, res);
  }
});

// ACTIVATED
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateApp, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated menu success.", result, res);
        },
        error => {
          response.error("Error while activated menu.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated menu.", error, res);
  }
});

//DELETED
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteApp, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete menu success.", result, res);
        },
        error => {
          response.error("Error while delete menu.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete menu.", error, res);
  }
});

//UPDATE MENU
router.post("/editMenu", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.updateApplicationMenu, {
        bind: [
          req.body.application_name,
          req.body.route,
          req.body.icon,
          req.body.updated_by,
          ipAddr,
          req.body.id
        ],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update menu success.", result, res);
        },
        error => {
          response.error("Error while updated menu.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated menu.", error, res);
  }
});

// GET application role
router.get("/role/:applicationId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getApplicationRoleById, {
        bind: [req.params.applicationId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List application role.", result, res);
        },
        error => {
          response.error("Error while get list application role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list application role.", error, res);
  }
});

//Add Application Role
router.post("/role", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addApplicationRole, {
        bind: [
          req.body.application_id,
          req.body.role_id,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Insert application role success.", result, res);
        },
        error => {
          response.error("Error while insert application role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while insert application role.", error, res);
  }
});

// ACTIVATED APP ROLE
router.post("/role/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.activateAppRole, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated app role success.", result, res);
        },
        error => {
          response.error("Error while activated app role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated app role.", error, res);
  }
});

//DELETED APP ROLE
router.post("/role/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.deleteAppRole, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete app role success.", result, res);
        },
        error => {
          response.error("Error while delete app role.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete app role.", error, res);
  }
});

module.exports = router;
