const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { amqpConnect } = require("./core/amqp");
const { config } = require("./core/config");
const { constants } = require("./core/constants");

/**
 * @type {import("amqplib/callback_api").Channel}
 */
let channel = null;

const commentsByPostId = new Map();

async function main() {
  channel = await amqpConnect(config.rabbitmq.url, config.rabbitmq.queue);

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
      content,
    };

    if (!commentsByPostId.has(postId)) commentsByPostId.set(postId, []);

    commentsByPostId.get(postId).push(newComment);

    channel.sendToQueue(
      config.rabbitmq.queue,
      Buffer.from(
        JSON.stringify({
          type: constants.events.createComment,
          data: {
            postId,
            comment: newComment,
          },
        })
      )
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
