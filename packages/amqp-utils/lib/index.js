const { amqpConnect } = require("./connect");
const { assertQueue } = require("./assert-queue");
const { assertExchange } = require("./assert-exchange");

module.exports = { assertQueue, amqpConnect, assertExchange };
