/**
 * Wraps Payload's migration commands via the local API instead of the
 * `payload` CLI bin. Invoking the bin directly (`node node_modules/.bin/payload`)
 * fails with ERR_REQUIRE_ASYNC_MODULE on this project: its nested tsx does a
 * synchronous require() of @payloadcms/richtext-lexical (ESM, top-level
 * await), which Node's require(esm) support explicitly does not allow. See
 * the migrations gotcha in AGENTS.md.
 *
 * Run:  npm run migrate | migrate:create -- <name> | migrate:status
 */
import payload from "payload";
import config from "../payload.config";

type Adapter = {
  createMigration: (args: { migrationName: string; payload: typeof payload }) => Promise<void>;
  migrate: () => Promise<void>;
  migrateStatus: () => Promise<void>;
};

async function main() {
  const [command, migrationName] = process.argv.slice(2);
  if (!command) {
    console.error("Usage: tsx scripts/migrate.ts <migrate|migrate:create|migrate:status> [migrationName]");
    process.exit(1);
  }

  process.env.PAYLOAD_MIGRATING = "true";
  await payload.init({ config, disableOnInit: true });
  const adapter = payload.db as unknown as Adapter;

  switch (command) {
    case "migrate":
      await adapter.migrate();
      break;
    case "migrate:create":
      if (!migrationName) throw new Error("Usage: tsx scripts/migrate.ts migrate:create <name>");
      await adapter.createMigration({ migrationName, payload });
      break;
    case "migrate:status":
      await adapter.migrateStatus();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }

  process.exit(0);
}

main();
