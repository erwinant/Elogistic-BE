var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sqlArea = require("../const/area");

/* ADD area. */
router.post("/", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.addArea, {
        bind: [req.body.area_name, req.body.created_by, ipAddr],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add area success.", result, res);
        },
        error => {
          response.error("Error while add area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add area.", error, res);
  }
});

/* GET area by project listing. */
router.post("/byProjectZone", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlArea.getAreaByProjectZone, {
        bind: [req.body.plant_code, req.body.zone_id],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List area by project zone.", result, res);
        },
        error => {
          response.error("Error while get area by project zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get area by project zone.", error, res);
  }
});

/* GET area. */
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlArea.getArea, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List area.", result, res);
        },
        error => {
          response.error("Error while get list area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get list area.", error, res);
  }
});

// activated area
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.activateArea, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated area success.", result, res);
        },
        error => {
          response.error("Error while activated area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated area.", error, res);
  }
});

//delete area
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.deleteArea, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete area success.", result, res);
        },
        error => {
          response.error("Error while delete area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete area.", error, res);
  }
});

//UPDATE Area
router.post("/edit", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.updateArea, {
        bind: [req.body.area_name, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update area success.", result, res);
        },
        error => {
          response.error("Error while updated area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated area.", error, res);
  }
});

/* GET area by areaId. */
router.get("/byArea/:areaId", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlArea.getAreaById, {
        bind: [req.params.areaId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List project zone by area.", result, res);
        },
        error => {
          response.error("Error while get project zone by area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get project zone by area.", error, res);
  }
});

// activated project zone area
router.post("/projectZone/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.activateMapAreaProjectZone, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated project zone success.", result, res);
        },
        error => {
          response.error("Error while activated project zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated project zone.", error, res);
  }
});

//delete project zone area
router.post("/projectZone/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.deleteMapAreaProjectZone, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete project zone success.", result, res);
        },
        error => {
          response.error("Error while delete project zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete project zone.", error, res);
  }
});

/* ADD project zone area. */
router.post("/zone/project", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlArea.addAreaProjectZone, {
        bind: [
          req.body.project_id,
          req.body.zone_id,
          req.body.area_id,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add project zone area success.", result, res);
        },
        error => {
          response.error("Error while add project zone area.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add project zone area.", error, res);
  }
});

module.exports = router;
