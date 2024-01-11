const config = {
  rabbitmq: {
    url: "amqp://localhost",
    exchange: "exchanges/blog",
    keys: {
      posts: {
        create: "posts.actions.create",
        update: "posts.actions.update",
      },
    },
  },
};

module.exports = { config };
