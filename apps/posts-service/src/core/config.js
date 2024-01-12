const config = {
  rabbitmq: {
    url: "amqp://localhost",
    exchange: "exchanges/blog",
    queue: "queues/blog/posts",
    keys: {
      posts: {
        create: "posts.actions.create",
        update: "posts.actions.update",
      },
    },
  },
};

module.exports = { config };
