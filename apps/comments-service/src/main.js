const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  amqpConnect,
  assertExchange,
  assertQueue,
} = require("@blog/amqp-utils");
const { config } = require("./core/config");
const { constants } = require("./core/constants");

/**
 * @type {import("amqplib/callback_api").Channel}
 */
let channel = null;

const commentsByPostId = new Map();

async function main() {
  channel = await amqpConnect(config.rabbitmq.url, config.rabbitmq.queue);

  await assertExchange(channel, config.rabbitmq.exchange, "topic", {
    durable: false,
  });

  const result = await assertQueue(channel, "", { exclusive: true });

  channel.bindQueue(
    result.queue,
    config.rabbitmq.exchange,
    config.rabbitmq.keys.comments.moderated
  );

  channel.consume(result.queue, (msg) => {
    if (!msg) return;

    if (msg.fields.routingKey === config.rabbitmq.keys.comments.moderated) {
      const content = JSON.parse(msg.content.toString());

      const comments = commentsByPostId.get(content.postId);

      if (!comments) return;

      const comment = comments.find((c) => c.id === content.id);

      if (!comment) return;

      comment.status = content.status;

      return;
    }
  });

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.get("/posts/:postId/comments", (req, res) => {
    const { postId } = req.params;

    const comments = commentsByPostId.get(postId) || [];

    res.status(200).json({
      success: true,
      data: comments,
    });
  });

  app.post("/posts/:postId/comments", (req, res) => {
    const targetId = uuidv4();
    const { postId } = req.params;
    const { content } = req.body;

    const newComment = {
      id: targetId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: constants.comments.status.pending,
      content,
    };

    if (!commentsByPostId.has(postId)) commentsByPostId.set(postId, []);

    commentsByPostId.get(postId).push(newComment);

    const payload = Buffer.from(
      JSON.stringify({
        postId,
        comment: newComment,
      })
    );

    channel.publish(
      config.rabbitmq.exchange,
      config.rabbitmq.keys.comments.create,
      payload
    );

    res.status(201).send({
      success: true,
      data: newComment,
    });
  });

  app.listen(3001, () => {
    console.log("Server listening on port 3001");
  });
}

main().catch((err) => {
  console.error("fatal error: ", err);
  process.exit(1);
});

process.on("exit", () => {
  channel?.close();
});
