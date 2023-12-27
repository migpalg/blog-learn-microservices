const amqp = require("amqplib/callback_api");

/**
 * Connects to RabbitMQ and returns a channel.
 * @param url {string} RabbitMQ URL
 * @returns {Promise<import("amqplib/callback_api").Channel>}
 */
function amqpConnect(url) {
  return new Promise((resolve, reject) => {
    amqp.connect(url, (err, conn) => {
      if (!conn || err) {
        reject(new Error(`Unable to connect to RabbitMQ: ${err}`));
        return;
      }

      conn.createChannel((err, channel) => {
        if (err) {
          reject(new Error(`Unable to create channel: ${err}`));
          return;
        }

        resolve(channel);
      });
    });
  });
}

function assertChannel(channel, queue, options) {
  return new Promise((resolve, reject) => {
    channel.assertQueue(queue, options, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports = { amqpConnect, assertChannel };
