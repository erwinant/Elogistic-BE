var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");
var sqlOrders = require("../const/order");

/* Submit Order. */
router.post("/", function(req, res, next) {
  let ip_addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlOrders.countOutstandingRecieveOrder, {
        bind: [req.body.created_by, 24, 4],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        validate => {
          if (validate[0].countOrderNotRecieve == 0) {
            model.sequelize
              .query(sqlOrders.getOrderNo, {
                type: model.sequelize.QueryTypes.SELECT
              })
              .then(
                result => {
                  model.sequelize
                    .query(sqlOrders.insertIntoTrOrder, {
                      bind: [
                        result[0].order_no,
                        req.body.plant_code,
                        req.body.zone_id,
                        req.body.area_id,
                        req.body.plant_code,
                        req.body.description,
                        req.body.created_by,
                        ip_addr
                      ],
                      type: model.sequelize.QueryTypes.INSERT
                    })
                    .then(
                      result2 => {
                        let flagSubmitDetail = true;
                        req.body.material.forEach(element => {
                          model.sequelize
                            .query(sqlOrders.insertIntoTrOrderD, {
                              bind: [
                                result[0].order_no,
                                req.body.created_by,
                                ip_addr,
                                element.material_code,
                                element.material_desc,
                                element.quantity,
                                element.storage_location_code,
                                element.storage_location_desc,
                                element.description,
                                element.lastHourMeter,
                                "1",
                                req.body.created_by,
                                ip_addr
                              ],
                              type: model.sequelize.QueryTypes.INSERT
                            })
                            .then(
                              result3 => {},
                              error => {
                                flagSubmitDetail = false;
                                response.error(
                                  "Error while submit request detail.",
                                  error,
                                  res
                                );
                              }
                            );
                        });
                        if (flagSubmitDetail == true) {
                          response.ok("Submit request success", result[0], res);
                        } else {
                          response.error(
                            "Error while submit request detail.",
                            {},
                            res
                          );
                        }
                      },
                      error => {
                        response.error(
                          "Error while submit request header.",
                          error,
                          res
                        );
                      }
                    );
                },
                error => {
                  response.error("Error while get order no.", error, res);
                }
              );
          } else {
            response.error(
              "Your order has been declined, because your previous order has not been received",
              [],
              res
            );
          }
        },
        error => {
          response.error(
            "Error while get order refrence by project.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get order no.", error, res);
  }
});

// GET LIST APPROVAL ORDER BY PROJECT
router.post("/byProject", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getOrderByProject, {
        bind: [req.body.plant_code, req.body.zone_id],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List order refrence by project.", result, res);
        },
        error => {
          response.error(
            "Error while get order refrence by project.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get order refrence by project.", error, res);
  }
});

// GET LIST APPROVAL ORDER BY PROJECT
router.get("/trackingOrder/:projectId", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.trackingOrderByProjectId, {
        bind: [req.params.projectId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("Data tracking order.", result, res);
        },
        error => {
          response.error("Error while track order.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while track order.", error, res);
  }
});

// GET HISTORY ORDER BY USER
router.post("/getHistoryOrder", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getHistoryOrder, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.body.created_by, req.body.start_date, req.body.end_date]
      })
      .then(
        result => {
          response.ok("List history order.", result, res);
        },
        error => {
          response.error("Error while get history order.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get history order2.", error, res);
  }
});

// GET HISTORY ORDER BY ORDER ID
router.get("/getHistoryOrder/:orderId", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getHistoryOrderByOrderId, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.params.orderId]
      })
      .then(
        result => {
          response.ok("List history order.", result, res);
        },
        error => {
          response.error("Error while get history order.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get history order2.", error, res);
  }
});

// GET PACKING ORDER BY PROJECT
router.post("/packingOrderByProject", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getPackingOrderByProject, {
        bind: [req.body.plant_code],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List order refrence by project.", result, res);
        },
        error => {
          response.error(
            "Error while get order refrence by project.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get order refrence by project.", error, res);
  }
});

// GET ORDER DETAIL
router.get("/detail/:orderId", function(req, res, next) {
  let data = null;
  try {
    model.sequelize
      .query(sqlOrders.getOrderByOrderId, {
        bind: [req.params.orderId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          data = result;
          model.sequelize
            .query(sqlOrders.getGINo, {
              bind: [req.params.orderId],
              type: model.sequelize.QueryTypes.SELECT
            })
            .then(resultGI => {
              data[0].no_good_issue = resultGI;
              response.ok("List order detail.", data, res);
            })
            .catch(error => {
              response.error("Error while get GI.", error, res);
            });
        },
        error => {
          response.error("Error while get order detail.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get order detail.", error, res);
  }
});

// APPROVE ORDER
router.post("/approvalProsess", function(req, res, next) {
  let ip_addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (req.body) {
    if (req.body.length == 0) {
      response.error("No data found!", [], res);
      return false;
    }
  }
  let dataReject = [];
  dataReject = req.body.filter(orderDetail => {
    if (orderDetail.status == 1) {
      return true;
    }
  });
  try {
    // validate while connection to slow,data appoved but page not refresh in UI
    model.sequelize
      .query(sqlOrders.validateBeforeApprove, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.body[0].tr_order_id, 1]
      })
      .then(validateApprove => {
        if (validateApprove[0].countApprove == 0) {
          response.error(
            "Your order has been approved, please reload the page."
          );
        } else {
          model.sequelize
            .query(sqlOrders.approveTrOrder, {
              bind: [
                dataReject.length == req.body.length ? 6 : 2,
                req.body[0].updated_by,
                ip_addr,
                req.body[0].tr_order_id,
                1
              ],
              type: model.sequelize.QueryTypes.UPDATE
            })
            .then(result => {
              // insert to prosess history
              model.sequelize
                .query(sqlOrders.approveToProsessHistory, {
                  bind: [
                    req.body[0].tr_order_id,
                    dataReject.length == req.body.length ? 6 : 2,
                    req.body[0].updated_by,
                    ip_addr
                  ],
                  type: model.sequelize.QueryTypes.INSERT
                })
                .then(result2 => {
                  try {
                    req.body.forEach(element => {
                      model.sequelize
                        .query(sqlOrders.approveTrOrderD, {
                          bind: [
                            element.status,
                            element.approval_notes,
                            req.body[0].updated_by,
                            ip_addr,
                            element.id,
                            1
                          ],
                          type: model.sequelize.QueryTypes.UPDATE
                        })
                        .then(result3 => {})
                        .catch(error => {
                          response.error(
                            "Error while approve order.",
                            error,
                            res
                          );
                        });
                      console.log("data update material detail");
                    });
                  } catch (error) {
                    response.error("Error while approve order.", error, res);
                  }
                  console.log("Wait until foreach or not");
                  response.ok("Approve success", req.body, res);
                })
                .catch(error => {
                  response.error(
                    "Error while insert prosess history.",
                    error,
                    res
                  );
                });
            })
            .catch(error => {
              response.error("Error while update tr order header.", error, res);
            });
        }
      })
      .catch(error => {
        response.error("Error while validate approve.", error, res);
      });
  } catch (error) {
    response.error("Error while approve order.", error, res);
  }
});

router.post("/packingProsess", async function(req, res, next) {
  let ip_addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (req.body) {
    if (req.body.length == 0) {
      response.error("No data found!", [], res);
      return false;
    }
  }
  let listEmptyStock = [];
  listEmptyStock = req.body.filter(orderDetail => {
    if (orderDetail.stock == 1) {
      return true;
    }
  });

  try {
    // validate while connection to slow,data appoved but page not refresh in UI
    let sql = "";
    model.sequelize
      .query(sqlOrders.validateBeforePackingProsess, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.body[0].tr_order_id]
      })
      .then(validateApprove => {
        if (validateApprove[0].countApprove == 0) {
          response.error(
            "This order has been packing, please reload the page.",
            [],
            res
          );
        } else {
          if (listEmptyStock.length < req.body.length) {
            if (req.body[0].tr_delivery_id != "0") {
              req.body.forEach(element => {
                let delivStatus =
                  element.quantity_shipping_new + element.quantity_shipping >=
                  element.quantity
                    ? 1
                    : 2;
                sql +=
                  "UPDATE tr_delivery_d SET quantity = " +
                  element.quantity_shipping_new +
                  ", delivery_status = " +
                  delivStatus +
                  ",updated_date = getdate(), updated_by = $2,ip_addr = $3 WHERE tr_order_d_id = " +
                  element.id +
                  " AND status = 1 AND delivery_status = 2;";
              });
            } else {
              sql += "DECLARE @tr_delivery_id BIGINT;";
              sql +=
                "INSERT INTO tr_delivery (tr_order_id, created_by, ip_addr) VALUES ($4,$2,$3);";
              sql += "SELECT @tr_delivery_id = SCOPE_IDENTITY();";
              req.body.forEach(element => {
                if (element.stock != "1") {
                  let qty =
                    element.stock == "2"
                      ? element.quantity
                      : element.quantity_shipping_new;
                  let stock = element.stock == "3" ? 2 : 1;
                  sql +=
                    "INSERT INTO tr_delivery_d (tr_delivery_id, tr_order_d_id, quantity, delivery_status, created_by, ip_addr) VALUES (@tr_delivery_id,'" +
                    element.id +
                    "','" +
                    qty +
                    "','" +
                    stock +
                    "',$2,$3);";
                }
              });
            }
          }
          sql +=
            "UPDATE tr_order set order_status = $1, updated_by = $2, updated_date = getdate(), ip_addr = $3 WHERE id = $4 AND order_status IN ($5,5);";
          sql +=
            "INSERT INTO prosess_history(order_id, status_id, created_by, ip_addr) VALUES($4, $1, $2, $3);";
          req.body.forEach(element => {
            let stock =
              element.stock == "3" &&
              element.quantity_shipping + element.quantity_shipping_new >=
                element.quantity
                ? 2
                : element.stock;
            let qtyShipping =
              (element.stock == "3" &&
                element.quantity_shipping + element.quantity_shipping_new >=
                  element.quantity) ||
              element.stock == "2"
                ? element.quantity
                : element.quantity_shipping + element.quantity_shipping_new;
            sql +=
              "UPDATE tr_order_d SET stock = " +
              stock +
              ", quantity_shipping = " +
              qtyShipping +
              ", updated_by = $2, updated_date = getdate(),ip_addr = $3 WHERE id = " +
              element.id +
              ";";
          });
          model.sequelize
            .transaction()
            .then(t => {
              model.sequelize
                .query(sql, {
                  transaction: t,
                  bind: [
                    listEmptyStock.length == req.body.length ? 7 : 3,
                    req.body[0].updated_by,
                    ip_addr,
                    req.body[0].tr_order_id,
                    2
                  ]
                })
                .then(result => {
                  t.commit();
                  response.ok("Packing order success", req.body, res);
                })
                .catch(error => {
                  t.rollback();
                  response.error("Error while packing prosess!", error, res);
                });
            })
            .catch(error => {
              response.error("Error while open transaction!", error, res);
            });
        }
      })
      .catch(error => {
        response.error("Error while validate packing.", error, res);
      });
  } catch (error) {
    response.error("Error while packing order.", error, res);
  }
});

//GET LIST DELIVERY ORDER
router.post("/getDeliveryOrder", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getDeliveryOrder, {
        bind: [req.body.plant_code],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List delivery order by project.", result, res);
        },
        error => {
          response.error(
            "Error while get delivery order by project.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get delivery order by project.", error, res);
  }
});

//GET LOCATION ORDER
router.get("/getLocation/:projectId", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getLocationByProjectId, {
        bind: [req.params.projectId],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(
        result => {
          response.ok("List location order by project.", result, res);
        },
        error => {
          response.error(
            "Error while get location order by project.",
            error,
            res
          );
        }
      );
  } catch (error) {
    response.error("Error while get location order by project.", error, res);
  }
});

//POST DELIVERY ORDER
router.post("/delivery", function(req, res, next) {
  let ip_addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    let sql = "";
    sql += "DECLARE @tr_recieve_order_id INT;";
    sql +=
      "UPDATE tr_delivery_d SET status = 2,delivery_by = $1,delivery_picture= $2,delivery_picture_2 = $3, no_good_issue = $4, updated_date = getdate(), updated_by = $5, ip_addr = $6 WHERE tr_delivery_id = $7 AND status = 1 AND delivery_status IN (1,2);";
    sql +=
      "INSERT INTO tr_delivery_d (tr_delivery_id, tr_order_d_id, quantity, delivery_status, created_by, ip_addr) (SELECT td.id,tdd.tr_order_d_id,0,2,$5,$6 FROM tr_delivery td INNER JOIN tr_delivery_d tdd ON td.id = tdd.tr_delivery_id WHERE td.id = $7 AND tdd.delivery_status = 2 AND tdd.status = 2);";
    sql +=
      "UPDATE tr_delivery_d SET delivery_status = 1 WHERE tr_delivery_id = $7 AND status = 2 AND delivery_status IN (1,2);";
    // Update Stock Balance
    sql +=
      "DECLARE @StockCursor as CURSOR; DECLARE @MaterialId as INT; DECLARE @ProjectId as INT; DECLARE @StorageLocationCode as NVARCHAR(20); DECLARE @Quantity as FLOAT; SET @StockCursor = CURSOR FOR SELECT m.id material_id,todr.project_id,tod.storage_location_code,tdd.quantity FROM tr_delivery_d tdd INNER JOIN tr_order_d tod ON tod.id = tdd.tr_order_d_id INNER JOIN tr_order todr ON todr.id = tod.tr_order_id INNER JOIN material m ON m.material_code = tod.material_code WHERE tdd.delivery_status = 1 AND tdd.tr_delivery_id = $7; OPEN @StockCursor; FETCH NEXT FROM @StockCursor INTO @Materialid,@ProjectId,@StorageLocationCode,@Quantity; WHILE @@FETCH_STATUS = 0 BEGIN UPDATE stock_balance SET unrestricted = unrestricted - @Quantity,updated_date = getdate(),updated_by = $5,ip_addr = $6 WHERE material_id = @MaterialId AND project_id = @ProjectId AND storage_location_code = @StorageLocationCode; FETCH NEXT FROM @StockCursor INTO @Materialid,@ProjectId,@StorageLocationCode,@Quantity; END CLOSE @StockCursor; DEALLOCATE @StockCursor;";
    // End Update Stock Balance
    sql +=
      "UPDATE tr_order SET order_status = 4, updated_date = getdate(), updated_by = $5, ip_addr = $6 WHERE id = $8;";
    sql +=
      "INSERT INTO tr_recieve_order (tr_delivery_id,created_by,ip_addr) (SELECT td.id,$5,$6 FROM tr_delivery td WHERE td.id = $7 AND  NOT EXISTS (SELECT 1 FROM tr_recieve_order WHERE tr_delivery_id = $7));";
    sql +=
      "IF @@ROWCOUNT >= 1 BEGIN SELECT @tr_recieve_order_id = SCOPE_IDENTITY(); END; ELSE BEGIN SELECT @tr_recieve_order_id = (SELECT id FROM tr_recieve_order tro WHERE tro.tr_delivery_id = $7); END;";
    sql +=
      "INSERT INTO tr_recieve_order_d(tr_recieve_order_id,tr_delivery_d_id,created_by,ip_addr) (SELECT @tr_recieve_order_id,tdd.id,$5,$6 FROM tr_delivery_d tdd WHERE tdd.delivery_status = 1 AND tdd.tr_delivery_id = $7);";
    sql +=
      "INSERT INTO prosess_history(order_id,status_id,delivery_by,created_by,ip_addr) VALUES ($8,4,$1,$5,$6)";
    let delivery_picture =
      req.body.order_no.replace(/\//g, "_") +
      "_" +
      new Date().getTime() +
      ".jpeg";
    let delivery_picture_2 =
      "material_" +
      req.body.order_no.replace(/\//g, "_") +
      "_" +
      new Date().getTime() +
      ".jpeg";
    model.sequelize
      .transaction()
      .then(t => {
        model.sequelize
          .query(sql, {
            transaction: t,
            bind: [
              req.body.pick_up_by,
              delivery_picture,
              delivery_picture_2,
              req.body.no_good_issue,
              req.body.updated_by,
              ip_addr,
              req.body.tr_delivery_id,
              req.body.id
            ]
          })
          .then(result => {
            var body = req.body.base64_url,
              base64Data = body.replace(/^data:image\/jpeg;base64,/, ""),
              binaryData = new Buffer(base64Data, "base64").toString("binary");

            require("fs").writeFile(
              "./public/images/" + delivery_picture,
              binaryData,
              "binary",
              function(err) {
                console.log(err); // writes out file without error, but it's not a valid image
              }
            );
            var body = req.body.base64_url_material,
              base64Data = body.replace(/^data:image\/jpeg;base64,/, ""),
              binaryData = new Buffer(base64Data, "base64").toString("binary");
            require("fs").writeFile(
              "./public/images/" + delivery_picture_2,
              binaryData,
              "binary",
              function(err) {
                console.log(err); // writes out file without error, but it's not a valid image
              }
            );
            t.commit();
            response.ok("Deliver success!", [], res);
          })
          .catch(error => {
            t.rollback();
            response.error("Error while delivery order", error, res);
          });
      })
      .catch(error => {
        response.error("Error while open transaction!", error, res);
      });
  } catch (error) {
    response.error("Error while update tr_order.", error, res);
  }
});

// Recieve Order
router.post("/recieveOrder", function(req, res, next) {
  let ip_addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    let body = req.body.recieve_image,
      base64Data = body.replace(/^data:image\/jpeg;base64,/, ""),
      binaryData = new Buffer(base64Data, "base64").toString("binary");
    let fileName =
      "RECIEVE_" +
      req.body.detail_recieve[0].tr_recieve_order_id +
      "_" +
      new Date().getTime() +
      ".jpeg";
    require("fs").writeFile(
      "./public/images/" + fileName,
      binaryData,
      "binary",
      function(err) {
        console.log(err); // writes out file without error, but it's not a valid image
      }
    );
    let sql = "";
    sql +=
      "INSERT INTO prosess_history(order_id, status_id, created_by, ip_addr) VALUES($1, 5, $2, $3);";
    sql +=
      "UPDATE tr_order SET order_status = 5, updated_date = getdate(), updated_by = $2, ip_addr = $3 WHERE id = $1;";
    sql +=
      "UPDATE tr_recieve_order SET status = 2, updated_date = getdate(), updated_by = $2, ip_addr = $3 WHERE id = $5;";
    sql +=
      "UPDATE tr_delivery SET status = 2, updated_date = getdate(), updated_by = $2, ip_addr = $3 WHERE id = $5;";
    req.body.detail_recieve.forEach(element => {
      sql +=
        "UPDATE tr_delivery_d SET delivery_status = 3, updated_date = getdate(), updated_by = $2, ip_addr = $3 WHERE id = " +
        element.tr_delivery_d_id +
        ";";
      sql +=
        "UPDATE tr_recieve_order_d SET status = 2, recieve_image = '" +
        fileName +
        "', recieve_note = '" +
        element.recieve_note +
        "',updated_date = getdate(), updated_by = $2, ip_addr = $3 WHERE id = " +
        element.id +
        ";";
    });
    model.sequelize
      .transaction()
      .then(t => {
        model.sequelize
          .query(sql, {
            transaction: t,
            bind: [
              req.body.detail_recieve[0].tr_order_id,
              req.body.created_by,
              ip_addr,
              fileName,
              req.body.detail_recieve[0].tr_recieve_order_id,
              req.body.detail_recieve[0].tr_delivery_id
            ]
          })
          .then(result => {
            t.commit();
            response.ok("Recieve Order Sukses", [], res);
          })
          .catch(error => {
            t.rollback();
            response.error("Error while Recieve Order!", error, res);
          });
      })
      .catch(error => {
        response.error("Error while Open Transaction!", error, res);
      });
  } catch (error) {
    response.error("Error while recieve order.", error, res);
  }
});

// GET OUTSTANDING RECIEVE
router.post("/outstandingRecieve", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.reportOutstandingRecieve, {
        type: model.sequelize.QueryTypes.SELECT,
        bind: [req.body.plant_code]
      })
      .then(
        result => {
          response.ok("List outstanding recieve.", result, res);
        },
        error => {
          response.error("Error while get outstanding recieve.", error, res);
        }
      );
  } catch (error) {
    response.error("Error while get outstanding recieve.", error, res);
  }
});

router.post("/printFNPB", function(req, res, next) {
  let ip_addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    model.sequelize
      .query(sqlOrders.printFNPBToProsessHistory, {
        bind: [req.body.order_id, req.body.created_by, ip_addr],
        type: model.sequelize.QueryTypes.INSERT
      })
      .then(
        result => {
          response.ok("Print FNPB success.", result, res);
        },
        error => {
          response.error("Error while Print FNPB success.", error, res);
        }
      );
  } catch (error) {
    D;
  }
});

router.post("/getRecieveOrder", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getRecieveOrder, {
        bind: [req.body.username],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(result => {
        response.ok("List Recieve Order.", result, res);
      })
      .catch(error => {
        response.error("Error While Get Recieve Order!", error, res);
      });
  } catch (error) {
    response.error("Error While Get Recieve Order!", error, res);
  }
});

router.get("/getDetailRecieve/:tr_recieve_order_id", function(req, res, next) {
  try {
    model.sequelize
      .query(sqlOrders.getDetailRecieve, {
        bind: [req.params.tr_recieve_order_id],
        type: model.sequelize.QueryTypes.SELECT
      })
      .then(result => {
        response.ok("List Detail Recieve Order.", result, res);
      })
      .catch(error => {
        response.error("Error While Get Detail Recieve Order!", error, res);
      });
  } catch (error) {
    response.error("Error While Get Detail Recieve Order!", error, res);
  }
});

module.exports = router;
