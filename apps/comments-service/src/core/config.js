const config = {
  rabbitmq: {
    url: "amqp://localhost",
    exchange: "exchanges/blog",
    queue: "queues/blog/comments",
    keys: {
      posts: {
        create: "posts.actions.create",
        update: "posts.actions.update",
      },
      comments: {
        create: "comments.actions.create",
        update: "comments.actions.update",
        moderated: "comments.actions.moderated",
      },
    },
  },
};

module.exports = { config };
