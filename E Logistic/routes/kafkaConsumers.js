var express = require("express");
var router = express.Router();
var kafka = require("kafka-node");
// var client = new kafka.KafkaClient({ kafkaHost: "asgard:9092" });
var model = require("../models/index");
var response = require("../response");
var paramSequelize = require("../entity/param-sequelize");
var indexName = "material";

// syncStockBalance();

function syncStockBalance() {
  let param = new paramSequelize();
  let keyMessaage = "stockBalance";
  let lastOffsetDefault = 0;
  param.sql =
    "SELECT * FROM last_offset_apache_kafka WHERE index_name = $1 AND key_message = $2";
  model.sequelize
    .query(param._sql, {
      type: model.sequelize.QueryTypes.SELECT,
      bind: [indexName, keyMessaage]
    })
    .then(lastOffset => {
      // get last offset
      if (lastOffset.length == 0) {
        model.sequelize
          .transaction()
          .then(t => {
            // open transaction
            param = new paramSequelize();
            param.sql =
              "INSERT INTO last_offset_apache_kafka (index_name, key_message) VALUES($1,$2)";
            model.sequelize
              .query(param._sql, {
                type: model.sequelize.QueryTypes.INSERT,
                bind: [indexName, keyMessaage],
                transaction: t
              })
              .then(insertOffset => {
                // insert offset
                var Consumer = kafka.Consumer,
                  consumer = new Consumer(
                    client,
                    [{ topic: "elogistic", offset: lastOffsetDefault }],
                    {
                      autoCommit: false,
                      fromOffset: true
                    }
                  );
                consumer.on("message", function(message) {
                  let bulkData = JSON.parse(message.value);
                  model.StgStockBalance.bulkCreate(bulkData, {
                    returning: false,
                    transaction: t
                  })
                    .then(bulkInsertStock => {
                      //bulk insert stock
                      param = new paramSequelize();
                      param.sql =
                        "UPDATE last_offset_apache_kafka SET last_offset = $1, last_sync_date = getdate() WHERE index_name = $2 AND key_message = $3";
                      model.sequelize
                        .query(param._sql, {
                          type: model.sequelize.QueryTypes.UPDATE,
                          bind: [message.offset, indexName, keyMessaage],
                          transaction: t
                        })
                        .then(updateOffset => {
                          console.log(
                            "Sync Ok!," + new Date().getTime().toString()
                          );
                          t.commit();
                        })
                        .catch(error => {
                          console.error(error);
                          t.rollback();
                        });
                    })
                    .catch(error => {
                      console.error(error);
                      t.rollback();
                    });
                });
              })
              .catch(error => {
                console.error(error);
                t.rollback();
              });
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        lastOffsetDefault = lastOffset[0].last_offset;
        console.log(lastOffsetDefault);
        var Consumer = kafka.Consumer,
          consumer = new Consumer(
            client,
            [{ topic: "elogistic", offset: lastOffsetDefault }],
            {
              autoCommit: false,
              fromOffset: true
            }
          );
        consumer.on("message", function(message) {
          model.sequelize
            .transaction()
            .then(t => {
              // open transaction
              let bulkData = JSON.parse(message.value);
              model.StgStockBalance.bulkCreate(bulkData, {
                transaction: t
              })
                .then(bulkInsertStock => {
                  //bulk insert stock
                  param = new paramSequelize();
                  param.sql =
                    "UPDATE last_offset_apache_kafka SET last_offset = $1, last_sync_date = getdate() WHERE index_name = $2 AND key_message = $3";
                  model.sequelize
                    .query(param._sql, {
                      type: model.sequelize.QueryTypes.UPDATE,
                      bind: [message.offset, indexName, keyMessaage],
                      transaction: t
                    })
                    .then(updateOffset => {
                      console.log(
                        "Sync Ok!," + new Date().getTime().toString()
                      );
                      t.commit();
                    })
                    .catch(error => {
                      console.error(error);
                      t.rollback();
                    });
                })
                .catch(error => {
                  console.error(error);
                  t.rollback();
                });
            })
            .catch(error => {
              console.error(error);
            });
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = router;
