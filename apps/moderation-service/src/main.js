async function main() {}

/**
 * @type {import("amqplib").Channel}
 */
let channel = null;

main().catch((e) => {
  console.error("fatal error:", e);
  process.exit(1);
});

process.on("exit", () => {
  channel?.close();
});
