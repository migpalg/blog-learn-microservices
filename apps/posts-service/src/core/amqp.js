const amqp = require("amqplib/callback_api");

/**
 * Connects to RabbitMQ and returns a channel.
 * @param url {string} RabbitMQ URL
 * @param queue {string} Queue name
 * @returns {Promise<import("amqplib/callback_api").Channel>}
 */
function amqpConnect(url, queue) {
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

        channel.assertQueue(queue, { durable: true });

        resolve(channel);
      });
    });
  });
}

module.exports = { amqpConnect };
