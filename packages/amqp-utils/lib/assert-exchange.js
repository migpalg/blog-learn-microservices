function assertExchange(channel, exchangeName, exchangeType, options) {
  return new Promise((resolve, reject) => {
    channel.assertExchange(exchangeName, exchangeType, options, (err, ok) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(ok);
    });
  });
}

module.exports = { assertExchange };
