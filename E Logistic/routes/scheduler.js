var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var XLSX = require("xlsx");
var path = "\\\\ASGARD\\Elogistic\\";
var pathHistory = "\\\\ASGARD\\Elogistic\\history\\";
var moment = require("moment");

var stockBalanceFileName = "Stock_" + moment().format("YYYYMMDD") + ".xls";
var materialFileName =
  "Master Material" + moment().format("YYYYMMDD") + ".xlsx";
var plantFileName = "Master Plant" + moment().format("YYYYMMDD") + ".xlsx";
var plantSlocFileName = "Plant VS Sloc" + moment().format("YYYYMMDD") + ".xlsx";
var mapPrjMtrlSlocFileName =
  "Material vs Plant-SLoc" + moment().format("YYYYMMDD") + ".xlsx";
var schedule = require("node-schedule");
var fs = require("fs");
// Time Schedule Plant
var rulePlant = new schedule.RecurrenceRule();
rulePlant.dayOfWeek = [new schedule.Range(1, 5)];
rulePlant.hour = 00;
rulePlant.minute = 00;
rulePlant.second = 1;
// Time Schedule Plant

// Time Schedule Material
var ruleMaterial = new schedule.RecurrenceRule();
ruleMaterial.dayOfWeek = [new schedule.Range(1, 5)];
ruleMaterial.hour = 00;
ruleMaterial.minute = 05;
ruleMaterial.second = 1;
// Time Schedule Material

// Time Schedule Plant - Storage Location
var rulePlantSloc = new schedule.RecurrenceRule();
rulePlantSloc.dayOfWeek = [new schedule.Range(1, 5)];
rulePlantSloc.hour = 00;
rulePlantSloc.minute = 20;
rulePlantSloc.second = 1;
// Time Schedule  Plant - Storage Location

// Time Schedule Plant - Storage Location - Material
var rulePlantSlocMaterial = new schedule.RecurrenceRule();
rulePlantSlocMaterial.dayOfWeek = [new schedule.Range(1, 5)];
rulePlantSlocMaterial.hour = 00;
rulePlantSlocMaterial.minute = 30;
rulePlantSlocMaterial.second = 1;
// Time Schedule  Plant - Storage Location - Material

// Time Schedule Stock Balance
var ruleStock = new schedule.RecurrenceRule();
ruleStock.dayOfWeek = [new schedule.Range(1, 5)];
ruleStock.hour = [06, 12, 18];
ruleStock.minute = 00;
ruleStock.second = 00;
// Time Schedule Stock Balance

// Time Schedule Development
var ruleDevelopment = "1 01 * * * *";
var ruleDevelopment2 = "2 01 * * * *";
var ruleDevelopment3 = "3 01 * * * *";
var ruleDevelopment4 = "4 01 * * * *";
var ruleDevelopment5 = "5 01 * * * *";
// Time Schedule Stock Balance

// Master Plant
schedule.scheduleJob(rulePlant, function() {
  try {
    if (fs.existsSync(path + plantFileName)) {
      console.log("===Start schedule master plant===");
      var workbookProject = XLSX.readFile(path + plantFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgPlant.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.copyFile(path + plantFileName, path + plantSlocFileName, () => {
            fs.rename(
              path + plantFileName,
              pathHistory + new Date().getTime() + "_" + plantFileName,
              () => {
                console.log("===End schedule master plant===");
              }
            );
          });
        })
        .catch(err => {
          response.log_error(err);
        });
    }
  } catch (error) {
    response.log_error(error);
  }
});
// End Masster Plant

// Master Material
schedule.scheduleJob(ruleMaterial, function() {
  try {
    if (fs.existsSync(path + materialFileName)) {
      console.log("===Start schedule master material===");
      var workbookMaterial = XLSX.readFile(path + materialFileName);
      var sheet_name_list_material = workbookMaterial.SheetNames;
      var xlDataMaterial = XLSX.utils.sheet_to_json(
        workbookMaterial.Sheets[sheet_name_list_material[0]]
      );
      model.StgMaterial.bulkCreate(xlDataMaterial, { returning: false })
        .then(result => {
          fs.rename(
            path + materialFileName,
            pathHistory + new Date().getTime() + "_" + materialFileName,
            () => {
              console.log("===End schedule master material===");
            }
          );
        })
        .catch(err => {
          response.log_error(err);
        });
    }
  } catch (error) {
    response.log_error(error);
  }
});
// End Masster Material

// Mapping Plant Storage Location
schedule.scheduleJob(rulePlantSloc, function() {
  try {
    if (fs.existsSync(path + plantSlocFileName)) {
      console.log("===Start schedule plant sloc===");
      var workbookProjectSloc = XLSX.readFile(path + plantSlocFileName);
      var sheet_name_list_project_sloc = workbookProjectSloc.SheetNames;
      var xlDataProjectSloc = XLSX.utils.sheet_to_json(
        workbookProjectSloc.Sheets[sheet_name_list_project_sloc[0]]
      );
      model.StgPlantSloc.bulkCreate(xlDataProjectSloc, { returning: false })
        .then(result => {
          fs.rename(
            path + plantSlocFileName,
            pathHistory + new Date().getTime() + "_" + plantSlocFileName,
            () => {
              console.log("===End schedule plant sloc===");
            }
          );
        })
        .catch(err => {
          response.log_error(err);
        });
    }
  } catch (error) {
    response.log_error(error);
  }
});
// End Mapping Plant Storage Location

// Mapping Plant Storage Location Material
schedule.scheduleJob(rulePlantSlocMaterial, function() {
  try {
    if (fs.existsSync(path + mapPrjMtrlSlocFileName)) {
      console.log("===Start schedule plant sloc material===");
      var workbookProject = XLSX.readFile(path + mapPrjMtrlSlocFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgPlantMaterialSloc.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.rename(
            path + mapPrjMtrlSlocFileName,
            pathHistory + new Date().getTime() + "_" + mapPrjMtrlSlocFileName,
            () => {
              console.log("===End schedule plant sloc material===");
            }
          );
        })
        .catch(err => {
          response.log_error(err);
        });
    }
  } catch (error) {
    response.log_error(error);
  }
});
// End Mapping Plant Storage Location Material

// Stock Balance
schedule.scheduleJob(ruleStock, function() {
  try {
    if (fs.existsSync(path + stockBalanceFileName)) {
      console.log("===Start schedule stock balance===");
      var workbookProject = XLSX.readFile(path + stockBalanceFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgStockBalance.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.rename(
            path + stockBalanceFileName,
            pathHistory + new Date().getTime() + "_" + stockBalanceFileName,
            () => {
              console.log("===End schedule stock balance===");
            }
          );
        })
        .catch(err => {
          response.log_error(err);
        });
    }
  } catch (error) {
    response.log_error(error);
  }
});
// End Stock Balance

//Untuk Migrasi
router.get("/stockBalance", function(req, res, next) {
  try {
    if (fs.existsSync(path + stockBalanceFileName)) {
      var workbookProject = XLSX.readFile(path + stockBalanceFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgStockBalance.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.rename(
            path + stockBalanceFileName,
            pathHistory + new Date().getTime() + "_" + stockBalanceFileName,
            () => {
              response.ok("Stock Balance schedule success.", [], res);
            }
          );
        })
        .catch(err => {
          response.error("Error while schedule stock balance.", err, res);
        });
    } else {
      response.ok("File not found.", [], res);
    }
  } catch (error) {
    response.error("Error while schedule stock balance.", error, res);
  }
});

router.get("/material", function(req, res, next) {
  try {
    console.log(materialFileName);
    if (fs.existsSync(path + materialFileName)) {
      var workbookMaterial = XLSX.readFile(path + materialFileName);
      var sheet_name_list_material = workbookMaterial.SheetNames;
      var xlDataMaterial = XLSX.utils.sheet_to_json(
        workbookMaterial.Sheets[sheet_name_list_material[0]]
      );
      model.StgMaterial.bulkCreate(xlDataMaterial, { returning: false })
        .then(result => {
          fs.rename(
            path + materialFileName,
            pathHistory + new Date().getTime() + "_" + materialFileName,
            () => {
              response.ok("Material schedule success.", [], res);
            }
          );
        })
        .catch(err => {
          response.error("Error while schedule material.", err, res);
        });
    } else {
      response.ok("File not found.", [], res);
    }
  } catch (error) {
    response.error("Error while schedule material.", error, res);
  }
});

router.get("/plant", function(req, res, next) {
  try {
    if (fs.existsSync(path + plantFileName)) {
      var workbookProject = XLSX.readFile(path + plantFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgPlant.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.copyFile(path + plantFileName, path + plantSlocFileName, () => {
            fs.rename(
              path + plantFileName,
              pathHistory + new Date().getTime() + "_" + plantFileName,
              () => {
                response.ok("Plant schedule success.", [], res);
              }
            );
          });
        })
        .catch(err => {
          response.error("Error while schedule plant.", err, res);
        });
    } else {
      response.ok("File not found.", [], res);
    }
  } catch (error) {
    response.error("Error while schedule plant.", error, res);
  }
});

router.get("/plantSloc", function(req, res, next) {
  try {
    if (fs.existsSync(path + plantSlocFileName)) {
      var workbookProject = XLSX.readFile(path + plantSlocFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgPlantSloc.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.rename(
            path + plantSlocFileName,
            pathHistory + new Date().getTime() + "_" + plantSlocFileName,
            () => {
              response.ok("Plant Sloc schedule success.", [], res);
            }
          );
        })
        .catch(err => {
          response.error("Error while schedule plant sloc.", err, res);
        });
    } else {
      response.ok("File not found.", [], res);
    }
  } catch (error) {
    response.error("Error while schedule plant sloc.", error, res);
  }
});

router.get("/materialPlantSloc", function(req, res, next) {
  try {
    if (fs.existsSync(path + mapPrjMtrlSlocFileName)) {
      var workbookProject = XLSX.readFile(path + mapPrjMtrlSlocFileName);
      var sheet_name_list_project = workbookProject.SheetNames;
      var xlDataProject = XLSX.utils.sheet_to_json(
        workbookProject.Sheets[sheet_name_list_project[0]]
      );
      model.StgPlantMaterialSloc.bulkCreate(xlDataProject, { returning: false })
        .then(result => {
          fs.rename(
            path + mapPrjMtrlSlocFileName,
            pathHistory + new Date().getTime() + "_" + mapPrjMtrlSlocFileName,
            () => {
              response.ok(
                "Mapping Material Project Sloc schedule success.",
                [],
                res
              );
            }
          );
        })
        .catch(err => {
          response.error("Error while schedule material plant sloc.", err, res);
        });
    } else {
      response.ok("File not found.", [], res);
    }
  } catch (error) {
    response.error("Error while schedule material plant sloc.", error, res);
  }
});
//Untuk Migrasi

module.exports = router;
