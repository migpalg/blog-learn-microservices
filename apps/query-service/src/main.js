const express = require("express");
const cors = require("cors");
const {
  amqpConnect,
  assertQueue,
  assertExchange,
} = require("@blog/amqp-utils");
const { config } = require("./core/config");

/**
 * @type {import("amqplib/callback_api").Channel}
 */
let channel;

const data = new Map();

async function main() {
  channel = await amqpConnect(config.rabbitmq.url);

  await assertExchange(channel, config.rabbitmq.exchange, "topic", {
    durable: false,
  });

  const result = await assertQueue(channel, "", { exclusive: true });

  channel.bindQueue(result.queue, config.rabbitmq.exchange, "posts.actions.*");
  channel.bindQueue(
    result.queue,
    config.rabbitmq.exchange,
    "comments.actions.*"
  );

  channel.consume(result.queue, (msg) => {
    if (!msg) return;

    if (msg.fields.routingKey === config.rabbitmq.keys.posts.create) {
      const content = JSON.parse(msg.content.toString());

      data.set(content.id, { ...content, comments: [] });

      return;
    }

    if (msg.fields.routingKey === config.rabbitmq.keys.posts.update) {
      const content = JSON.parse(msg.content.toString());

      const post = data.get(content.id);

      if (!post) {
        return;
      }

      data.set(content.id, { ...post, ...content });

      return;
    }

    if (msg.fields.routingKey === config.rabbitmq.keys.comments.create) {
      const content = JSON.parse(msg.content.toString());

      const post = data.get(content.postId);

      if (!post) {
        return;
      }

      post.comments.push(content.comment);

      return;
    }

    if (msg.fields.routingKey === config.rabbitmq.keys.comments.moderated) {
      const content = JSON.parse(msg.content.toString());

      const post = data.get(content.postId);

      if (!post) {
        return;
      }

      const comment = post.comments.find((c) => c.id === content.id);

      if (!comment) {
        return;
      }

      comment.status = content.status;

      return;
    }
  });

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/query/posts", (req, res) => {
    const posts = Array.from(data.values());

    res.status(200).json({
      success: true,
      data: posts,
    });
  });

  app.listen(3002, () => {
    console.log("Server is running on http://localhost:3002");
  });
}

main().catch((e) => {
  console.error("fatal error", e);
  process.exit(1);
});

process.on("exit", () => {
  channel?.close();
});
