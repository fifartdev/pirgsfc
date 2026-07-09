import "server-only";
import { getPayload as _getPayload } from "payload";
import config from "@payload-config";

/**
 * Returns an initialised Payload client.
 * Returns null if DATABASE_URI is not set (allows static export / dev mode
 * without a database to still build the site with static data).
 */
export async function getPayloadClient() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    return null;
  }
  try {
    return await _getPayload({ config });
  } catch (err) {
    console.error("[Payload] Failed to initialise:", err);
    return null;
  }
}
