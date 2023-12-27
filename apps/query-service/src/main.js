const express = require("express");
const cors = require("cors");
const { amqpConnect, assertChannel } = require("./core/amqp");
const { config } = require("./core/config");
const { constants } = require("./core/constants");

/**
 * @type {import("amqplib/callback_api").Channel}
 */
let channel;

const data = new Map();

async function main() {
  channel = await amqpConnect(config.rabbitmq.url);

  await assertChannel(channel, config.rabbitmq.queue);

  channel.consume(config.rabbitmq.queue, (msg) => {
    if (!msg) return;

    const event = JSON.parse(msg.content.toString());

    if (event.type === constants.events.createPost) {
      const content = event.data;

      data.set(content.id, { ...content, comments: [] });

      channel.ack(msg);
    }

    if (event.type === constants.events.createComment) {
      const content = event.data;

      const post = data.get(content.postId);

      if (!post) {
        channel.ack(msg);
        return;
      }

      post.comments.push(content.comment);

      channel.ack(msg);
    }

    if (event.type === constants.events.updatePost) {
      const content = event.data;

      const post = data.get(content.id);

      if (!post) {
        channel.ack(msg);
        return;
      }

      data.set(content.id, { ...post, ...content });

      channel.ack(msg);
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
