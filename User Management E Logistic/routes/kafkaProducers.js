var express = require("express");
var router = express.Router();
var model = require("../models/index");
var response = require("../response");

router.post("/sendPayload", function(req, res, next) {
  let kafka = require("kafka-node"),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.KafkaClient({ kafkaHost: "asgard:9092" }),
    producer = new Producer(client),
    km = new KeyedMessage(req.body.key, JSON.stringify(req.body.value)),
    payloads = [{ topic: "elogistic", messages: [km] }];

  producer.on("ready", function() {
    producer.send(payloads, function(err, data) {
      if (err) {
        response.error("Error while send payload.", err, res);
      } else {
        response.ok("Send payload success!", data, res);
      }
    });
  });

  producer.on("error", function(err) {
    response.error("Error while send payload.", err, res);
  });
});

module.exports = router;
