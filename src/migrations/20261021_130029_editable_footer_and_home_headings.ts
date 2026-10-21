import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "club_info" ADD COLUMN "footer_statement" varchar;
  ALTER TABLE "club_info" ADD COLUMN "footer_statement_en" varchar;
  ALTER TABLE "club_info" ADD COLUMN "tagline" varchar;
  ALTER TABLE "club_info" ADD COLUMN "tagline_en" varchar;
  ALTER TABLE "home_content" ADD COLUMN "values_eyebrow" varchar;
  ALTER TABLE "home_content" ADD COLUMN "values_eyebrow_en" varchar;
  ALTER TABLE "home_content" ADD COLUMN "values_title" varchar;
  ALTER TABLE "home_content" ADD COLUMN "values_title_en" varchar;
  ALTER TABLE "home_content" ADD COLUMN "values_text" varchar;
  ALTER TABLE "home_content" ADD COLUMN "values_text_en" varchar;
  ALTER TABLE "home_content" ADD COLUMN "sponsors_title" varchar;
  ALTER TABLE "home_content" ADD COLUMN "sponsors_title_en" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "club_info" DROP COLUMN "footer_statement";
  ALTER TABLE "club_info" DROP COLUMN "footer_statement_en";
  ALTER TABLE "club_info" DROP COLUMN "tagline";
  ALTER TABLE "club_info" DROP COLUMN "tagline_en";
  ALTER TABLE "home_content" DROP COLUMN "values_eyebrow";
  ALTER TABLE "home_content" DROP COLUMN "values_eyebrow_en";
  ALTER TABLE "home_content" DROP COLUMN "values_title";
  ALTER TABLE "home_content" DROP COLUMN "values_title_en";
  ALTER TABLE "home_content" DROP COLUMN "values_text";
  ALTER TABLE "home_content" DROP COLUMN "values_text_en";
  ALTER TABLE "home_content" DROP COLUMN "sponsors_title";
  ALTER TABLE "home_content" DROP COLUMN "sponsors_title_en";`)
}
