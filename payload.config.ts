import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

// Collections
import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Seasons } from "./src/collections/Seasons";
import { Teams } from "./src/collections/Teams";
import { Leagues } from "./src/collections/Leagues";
import { Players } from "./src/collections/Players";
import { Rosters } from "./src/collections/Rosters";
import { Venues } from "./src/collections/Venues";
import { Matches } from "./src/collections/Matches";
import { NewsCategories } from "./src/collections/NewsCategories";
import { News } from "./src/collections/News";
import { Staff } from "./src/collections/Staff";
import { StaffAssignments } from "./src/collections/StaffAssignments";

// Globals
import { SiteSettings } from "./src/globals/SiteSettings";
import { ClubInfo } from "./src/globals/ClubInfo";
import { SeoDefaults } from "./src/globals/SeoDefaults";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.PAYLOAD_SECRET) {
  throw new Error("Missing PAYLOAD_SECRET environment variable");
}

if (!process.env.DATABASE_URI) {
  throw new Error("Missing DATABASE_URI environment variable");
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — PYRGOS AFC Admin",
      icons: [{ rel: "icon", url: "/favicon.ico" }],
    },
    // Only superadmin users are granted admin UI access.
    // Checked at the Users collection level via access.admin.
  },

  collections: [
    Users,
    Media,
    Seasons,
    Teams,
    Leagues,
    Players,
    Rosters,
    Venues,
    Matches,
    NewsCategories,
    News,
    Staff,
    StaffAssignments,
  ],

  globals: [SiteSettings, ClubInfo, SeoDefaults],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET,

  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },

  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },

  cors: [process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"],

  csrf: [process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"],
});
