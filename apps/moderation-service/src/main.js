const express = require("express");
const cors = require("cors");
const {
  amqpConnect,
  assertQueue,
  assertExchange,
} = require("@blog/amqp-utils");
const { config } = require("./core/config");
const { constants } = require("./core/constants");

/**
 * @type {import("amqplib").Channel}
 */
let channel = null;

const moderationQueue = new Set();

async function main() {
  channel = await amqpConnect(config.rabbitmq.url, config.rabbitmq.queue);

  await assertExchange(channel, config.rabbitmq.exchange, "topic", {
    durable: false,
  });

  const result = await assertQueue(channel, "", { exclusive: true });

  channel.bindQueue(
    result.queue,
    config.rabbitmq.exchange,
    "comments.actions.*"
  );

  channel.consume(result.queue, (msg) => {
    if (!msg) return;

    if (msg.fields.routingKey === config.rabbitmq.keys.comments.create) {
      const content = JSON.parse(msg.content.toString());

      moderationQueue.add({
        postId: content.postId,
        commentId: content.comment.id,
        status: content.comment.status,
      });

      return;
    }
  });

  const app = express();

  app.post("/comments/moderate", (_, res) => {
    if (moderationQueue.size === 0) {
      res.send({ success: true, message: "no comments to moderate" });
      return;
    }

    const cloneQueue = new Set(moderationQueue);

    for (const comment of cloneQueue) {
      const payload = Buffer.from(
        JSON.stringify({
          postId: comment.postId,
          id: comment.commentId,
          status: constants.comments.status.approved,
        })
      );

      channel.publish(
        config.rabbitmq.exchange,
        config.rabbitmq.keys.comments.moderated,
        payload
      );

      moderationQueue.delete(comment);
    }

    res.send({ success: true, message: "comments moderated" });
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(3003, () => {
    console.log("listening on port 3003");
  });
}

main().catch((e) => {
  console.error("fatal error:", e);
  process.exit(1);
});

process.on("exit", () => {
  channel?.close();
});
