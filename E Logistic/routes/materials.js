var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var elasticsearch = require("elasticsearch");
var sqlMaterials = require("../const/material");
var client = new elasticsearch.Client({
  host: "http://asgard:9200",
  apiVersion: "7.4" // use the same version of your Elasticsearch instance
});

require("array.prototype.flatmap").shim();

router.post("/byProject", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.getMaterialByProject, {
        bind: [req.body.plant_code, req.body.material_desc],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List material.", result, res);
        },
        error => {
          response.error("Error while get material.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get material.", error, res);
  }
});

/* GET material by project and sloc. */
router.post("/byProjectAndSloc", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.getMaterialByProjectAndSloc, {
        bind: [req.body.projectId, req.body.sloc],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List stock material.", result, res);
        },
        error => {
          response.error("Error while get stock material.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get stock material.", error, res);
  }
});

/* GET Last Update Stock. */
router.get("/lastUpdateStock", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.getLastUpdateStock, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("Last update stock.", result, res);
        },
        error => {
          response.error("Error while get last update stock.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get last update stock.", error, res);
  }
});

/* GET List sloc project. */
router.get("/getSlocProject", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.getSlocProject, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List sloc project.", result, res);
        },
        error => {
          response.error("Error while get List sloc project.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get List sloc project.", error, res);
  }
});

/* GET sloc by projectId. */
router.post("/getSlocByProjectId", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.getSlocProjectByProjectId, {
        bind: [req.body.projectId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List sloc project by project id.", result, res);
        },
        error => {
          response.error(
            "Error while get List sloc project by project id.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while get List sloc project by project id.",
      error,
      res
    );
  }
});

/* GET TOP 5 BEST MATERIAL ORDER. */
router.post("/top10ByQuantity", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.top10OutgoingMaterialByQuantity, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List TOP 10 BEST MATERIAL ORDER.", result, res);
        },
        error => {
          response.error(
            "Error while get TOP 10 BEST MATERIAL ORDER.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get TOP 10 BEST MATERIAL ORDER.", error, res);
  }
});

/* GET TOP 5 BEST MATERIAL ORDER. */
router.post("/top10ByAmount", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.top10OutgoingMaterialByOrderAmount, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List TOP 10 BEST MATERIAL ORDER.", result, res);
        },
        error => {
          response.error(
            "Error while get TOP 10 BEST MATERIAL ORDER.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get TOP 10 BEST MATERIAL ORDER.", error, res);
  }
});

/* GET  Outgoing Material. */
router.post("/outgoing", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.reportOutgoingMaterial, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List Outgoing Material.", result, res);
        },
        error => {
          response.error("Error while get Outgoing Material.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get TOP 5 BEST MATERIAL ORDER.", error, res);
  }
});

/* GET TOP 10 Empty Stock By Quantity. */
router.post("/top10EmptyStockByQuantity", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.top10EmptyStockByQuantity, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List TOP 10 Empty Stock By Quantity.", result, res);
        },
        error => {
          response.error(
            "Error while get TOP 10 Empty Stock By Quantity.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while get TOP 10 Empty Stock By Quantity.",
      error,
      res
    );
  }
});

/* GET TOP 10 Empty Stock By Order Amount. */
router.post("/top10EmptyStockByOrderAmount", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.top10EmptyStockByOrderAmount, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List TOP 10 Empty Stock By Order Amount.", result, res);
        },
        error => {
          response.error(
            "Error while get TOP 10 Empty Stock By Order Amount.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error(
      "Error while get TOP 10 Empty Stock By Order Amount.",
      error,
      res
    );
  }
});

/* GET  Empty Stock Material. */
router.post("/emptyStock", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.reportEmptyStock, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List Empty Stock Material.", result, res);
        },
        error => {
          response.error("Error while get Empty Stock Material.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get Empty Stock.", error, res);
  }
});

/* REPORT REQUEST ORDER. */
router.post("/requestOrder", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.reportRequestOrder, {
        bind: [req.body.plant_code, req.body.start_date, req.body.end_date],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List Report Request Order.", result, res);
        },
        error => {
          response.error("Error while get Report Request Order.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get Report Request Order.", error, res);
  }
});

/* GET  data vertical bar request order. */
router.post("/vBarRequestOrder", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.vBarChartReportRequestOrder, {
        bind: [
          req.body.start_date,
          req.body.end_date,
          req.body.start_date,
          req.body.end_date,
          req.body.plant_code
        ],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List Data Vertical Bar Request Order.", result, res);
        },
        error => {
          response.error(
            "Error while get Vertical Bar Request Order.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get Vertical Bar Request Order.", error, res);
  }
});

/* GET  data vertical bar request order. */
router.post("/reportMaterialRecieve", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.reportMaterialRecieve, {
        bind: [req.body.start_date, req.body.end_date, req.body.plant_code],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List Data Report Material Recieve.", result, res);
        },
        error => {
          response.error(
            "Error while get Report Material Recieve.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get Report Material Recieve.", error, res);
  }
});

router.post("/elasticsearch/init", async function(req, res, next) {
  try {
    await client.indices.create(req.body).then(result => {
      response.ok("Init success!", result, res);
    });
  } catch (error) {
    response.error("Init error!", error, res);
  }
});

router.post("/elasticsearch/exists", async function(req, res, next) {
  try {
    await client.indices.exists(req.body).then(result => {
      response.ok("Index exists!", result, res);
    });
  } catch (error) {
    response.error("Find exists index error!", error, res);
  }
});

router.post("/elasticsearch/add", async function(req, res, next) {
  try {
    await client.index(req.body).then(result => {
      response.ok("Add/update index success!", result, res);
    });
  } catch (error) {
    response.error("Add/update index error!", error, res);
  }
});

router.put("/elasticsearch/add/fromdb", async function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.getMaterialForElastic, {
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          const body = result.flatMap(doc => [
            { index: { _index: "material" } },
            doc
          ]);
          client.bulk({ refresh: false, body }).then(resultES => {
            response.ok("Add/update index material from db success!", [], res);
          });
        },
        error => {
          response.error(
            "Error while Add/update index material from db!",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Add/update index error!", error, res);
  }
});

router.post("/elasticsearch/find", function(req, res, next) {
  try {
    client.search(req.body).then(
      result => {
        response.ok(
          "Find success!",
          result.hits.hits ? result.hits.hits : result,
          res
        );
      },
      error => {
        response.error("Find error!", error, res);
      }
    );
  } catch (error) {
    response.error("elasticsearch cluster is down!", error, res);
  }
});

router.post("/elasticsearch/delete", async function(req, res, next) {
  try {
    client.deleteByQuery(req.body, function(error, result) {
      if (error) {
        response.error(error.message, error, res);
      } else {
        response.ok("Delete index success!", result, res);
      }
    });
  } catch (error) {
    response.error("Delete index error!", error, res);
  }
});

router.post("/countStock", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.countStockMaterial, {
        bind: [
          req.body.PROJECT_ID,
          req.body.MATERIAL_ID,
          req.body.STORAGE_LOCATION_CODE
        ],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("Count stock.", result, res);
        },
        error => {
          response.error("Error while get count stock!", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get count stock!", error, res);
  }
});

router.post("/hasNotBeenSent", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlMaterials.hasNotBeenSent, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.body.created_by, req.body.material_code]
      })
      .then(result => {
        response.ok("Material has not been sent", result, res);
      })
      .catch(error => {
        response.error(
          "Error while get material has not been sent!",
          error,
          res
        );
      });
  } catch (error) {
    response.error("Error while get material has not been sent!", error, res);
  }
});
module.exports = router;
