export async function register() {
  // Only initialise Payload on the Node.js runtime (not edge workers)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.DATABASE_URI && process.env.PAYLOAD_SECRET) {
      const { getPayload } = await import("payload");
      const config = await import("@payload-config");
      // Pre-warm the Payload singleton on server start
      await getPayload({ config: config.default }).catch((err) =>
        console.error("[Payload] Warm-up error:", err)
      );
    }
  }
}
