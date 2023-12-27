const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { amqpConnect } = require("./core/amqp");
const { config } = require("./core/config");
const { constants } = require("./core/constants");

/**
 * @type {import("amqplib/callback_api").Channel}
 */
let channel = null;

/**
 * Map of posts.
 */
const posts = new Map();

/**
 * Entry point of the application.
 */
async function main() {
  // Connect to RabbitMQ
  channel = await amqpConnect(config.rabbitmq.url);

  // Create an express application
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.get("/posts", (_, res) => {
    const sortedPosts = Array.from(posts.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    res.status(200).json({
      success: true,
      data: sortedPosts,
    });
  });

  app.post("/posts", (req, res) => {
    const { title, content } = req.body;
    const targetId = uuidv4();

    const newPost = {
      id: targetId,
      createdAt: new Date(),
      updatedAt: new Date(),
      title,
      content,
    };

    posts.set(targetId, newPost);

    channel.sendToQueue(
      config.rabbitmq.queue,
      Buffer.from(
        JSON.stringify({ type: constants.events.createPost, data: newPost })
      )
    );

    res.status(201).json({
      success: true,
      data: newPost,
    });
  });

  app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const targetPost = posts.get(id);

    if (!targetPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const updatedPost = {
      ...targetPost,
      title: title || targetPost.title,
      content: content || targetPost.content,
      updatedAt: new Date(),
    };

    posts.set(id, updatedPost);

    channel.sendToQueue(
      config.rabbitmq.queue,
      Buffer.from(
        JSON.stringify({ type: constants.events.updatePost, data: updatedPost })
      )
    );

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  });

  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
}

main().catch((e) => {
  console.error("fatal error: ", e);
  process.exit(1);
});

process.on("exit", () => {
  channel?.close();
});
