import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

// Collections
import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Seasons } from "./src/collections/Seasons";
import { Teams } from "./src/collections/Teams";
import { Clubs } from "./src/collections/Clubs";
import { Leagues } from "./src/collections/Leagues";
import { Players } from "./src/collections/Players";
import { Rosters } from "./src/collections/Rosters";
import { Venues } from "./src/collections/Venues";
import { Matches } from "./src/collections/Matches";
import { LeagueTables } from "./src/collections/LeagueTables";
import { NewsCategories } from "./src/collections/NewsCategories";
import { News } from "./src/collections/News";
import { Staff } from "./src/collections/Staff";
import { StaffAssignments } from "./src/collections/StaffAssignments";

// Globals
import { SiteSettings } from "./src/globals/SiteSettings";
import { ClubInfo } from "./src/globals/ClubInfo";
import { SeoDefaults } from "./src/globals/SeoDefaults";
import { HomeContent } from "./src/globals/HomeContent";
import { AboutContent } from "./src/globals/AboutContent";
import { ContactContent } from "./src/globals/ContactContent";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Origins allowed to authenticate via the payload-token cookie. A single
// static NEXT_PUBLIC_SERVER_URL can't track Vercel preview deployments,
// which get a unique *.vercel.app URL per build — without VERCEL_URL here,
// the cookie's Origin check silently fails and every write request (e.g.
// media uploads) comes back "not allowed to perform this action".
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SERVER_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  "http://localhost:3000",
].filter((url): url is string => Boolean(url));

// Do NOT validate env vars here. Top-level throws cause the module to fail
// evaluation under Turbopack, making `config` undefined everywhere it is
// imported and producing a misleading "Cannot destructure property 'config'"
// TypeError. Payload validates PAYLOAD_SECRET at getPayload() time.

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
    Clubs,
    Leagues,
    Players,
    Rosters,
    Venues,
    Matches,
    LeagueTables,
    NewsCategories,
    News,
    Staff,
    StaffAssignments,
  ],

  globals: [SiteSettings, ClubInfo, SeoDefaults, HomeContent, AboutContent, ContactContent],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  editor: lexicalEditor({}),

  // Required for Media's imageSizes/adminThumbnail (src/collections/Media.ts) to
  // actually generate resized variants — without this, Payload silently skips
  // resizing even though sharp is installed (it must be passed explicitly, not
  // just present in node_modules).
  sharp,

  secret: process.env.PAYLOAD_SECRET ?? "",

  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },

  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },

  // Falls back to local disk storage when BLOB_READ_WRITE_TOKEN is unset
  // (e.g. local dev without Blob configured).
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  cors: allowedOrigins,

  csrf: allowedOrigins,
});
