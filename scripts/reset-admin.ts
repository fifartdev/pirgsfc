/**
 * Reset the superadmin password.
 *
 * Run:  npm run reset-admin
 *
 * Prints each user found, then sets their password to the value in
 * ADMIN_TEMP_PASSWORD (defaults to "ChangeMe123!" if not set).
 */

import { getPayload } from "payload";
import config from "../payload.config";

async function main() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "users",
    limit: 20,
    depth: 0,
  });

  if (docs.length === 0) {
    console.log("No users found in the database.");
    console.log("Visit http://localhost:3000/admin/create-first-user to create the first admin.");
    process.exit(0);
  }

  const newPassword = process.env.ADMIN_TEMP_PASSWORD ?? "ChangeMe123!";

  console.log(`Found ${docs.length} user(s):\n`);
  for (const user of docs) {
    const email = (user as { email: string }).email;
    const role = (user as { role?: string }).role ?? "(no role field)";
    console.log(`  • ${email}  [role: ${role}]`);

    await payload.update({
      collection: "users",
      id: user.id,
      data: { password: newPassword } as Record<string, unknown>,
    });
    console.log(`    ✓ password reset`);
  }

  console.log(`\nAll passwords set to: ${newPassword}`);
  console.log("Log in at http://localhost:3000/admin/login");
  console.log("Change the password after logging in.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
