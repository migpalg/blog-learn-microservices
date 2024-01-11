/**
 * Asserts a queue
 * @returns {Promise<import('amqplib').Replies.AssertQueue>}
 */
function assertQueue(channel, queue, options) {
  return new Promise((resolve, reject) => {
    channel.assertQueue(queue, options, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

module.exports = { assertQueue };
