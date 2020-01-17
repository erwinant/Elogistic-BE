var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sql = require("../const/zone");

/* ADD zone. */
router.post("/", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sql.addZone, {
        bind: [req.body.zone_name, req.body.created_by, ipAddr],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Add zone success.", result, res);
        },
        error => {
          response.error("Error while add zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while add zone.", error, res);
  }
});

/* GET zone. */
router.get("/", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getZone, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List zone.", result, res);
        },
        error => {
          response.error("Error while get zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get zone.", error, res);
  }
});

/* GET zone project by zone id. */
router.get("/byZone/:zoneId", function(req, res, next) {
  try {
    model.sequelize
      .query(
        "select a.id,a.project_id, b.plant_code, b.project_name, a.zone_id, c.zone_name, a.is_active, a.deleted  from map_project_zone a INNER JOIN project b on a.project_id = b.id INNER JOIN zone c on a.zone_id = c.id WHERE a.deleted = 0 AND b.deleted = 0 AND c.deleted = 0 AND a.zone_id = $1",
        {
          bind: [req.params.zoneId],
          type: model.sequelize.QueryTypes.SELECT
        }
      )
      .then(
        result => {
          response.ok("List zone project.", result, res);
        },
        error => {
          response.error("Error while get zone project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get zone project.", error, res);
  }
});

/* GET zone by project listing. */
router.post("/byProject", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getZoneByProject, {
        bind: [req.body.plant_code],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List zone by project.", result, res);
        },
        error => {
          response.error("Error while get zone by project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get zone by project.", error, res);
  }
});

// activated zone
router.post("/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.activatedZone, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated zone success.", result, res);
        },
        error => {
          response.error("Error while activated zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated zone.", error, res);
  }
});

//delete zone
router.post("/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.deleteZone, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete zone success.", result, res);
        },
        error => {
          response.error("Error while delete zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete zone.", error, res);
  }
});

//UPDATE Zone
router.post("/edit", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.updateZone, {
        bind: [req.body.zone_name, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Update zone success.", result, res);
        },
        error => {
          response.error("Error while updated zone.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while updated zone.", error, res);
  }
});

// activated zone
router.post("/project/activated", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.activatedZoneProject, {
        bind: [req.body.is_active, req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Activated zone project success.", result, res);
        },
        error => {
          response.error("Error while activated zone project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while activated zone project.", error, res);
  }
});

//delete zone
router.post("/project/delete", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.deleteZoneProject, {
        bind: [req.body.updated_by, ipAddr, req.body.id],
        type: model.sequelize.QueryTypes.UPDATE
      })
      .then(
        result => {
          response.ok("Delete zone project success.", result, res);
        },
        error => {
          response.error("Error while delete zone project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while delete zone project.", error, res);
  }
});

router.post("/project", function(req, res, next) {
  let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // var plainObject = jwt.verify(req.headers["authorization"], secretKey);
    model.sequelize
      .query(sql.addZoneProject, {
        bind: [
          req.body.project_id,
          req.body.zone_id,
          req.body.created_by,
          ipAddr
        ],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Insert project zone success.", result, res);
        },
        error => {
          response.error("Error while insert project zone .", error, res);
        }
      );
  } catch (error) {
    response.error("Error while insert project zone .", error, res);
  }
});

/* GET zone by project id. */
router.get("/project/:projectId", function(req, res, next) {
  try {
    model.sequelize
      .query(sql.getZoneByProjectId, {
        bind: [req.params.projectId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List zone by project id.", result, res);
        },
        error => {
          response.error("Error while get zone by project id.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get zone by project id.", error, res);
  }
});

module.exports = router;
