import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "academy_content_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"name_en" varchar,
  	"ages" varchar,
  	"ages_en" varchar,
  	"coach" varchar,
  	"coach_en" varchar,
  	"training_days" varchar,
  	"training_days_en" varchar,
  	"description" varchar,
  	"description_en" varchar
  );
  
  CREATE TABLE "academy_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"eyebrow_en" varchar,
  	"title" varchar,
  	"title_en" varchar,
  	"hero_text" varchar,
  	"hero_text_en" varchar,
  	"philosophy_eyebrow" varchar,
  	"philosophy_eyebrow_en" varchar,
  	"philosophy_title" varchar,
  	"philosophy_title_en" varchar,
  	"philosophy1" varchar,
  	"philosophy1_en" varchar,
  	"philosophy2" varchar,
  	"philosophy2_en" varchar,
  	"graduates_eyebrow" varchar,
  	"graduates_eyebrow_en" varchar,
  	"graduates_title" varchar,
  	"graduates_title_en" varchar,
  	"graduates_text" varchar,
  	"graduates_text_en" varchar,
  	"groups_title" varchar,
  	"groups_title_en" varchar,
  	"groups_text" varchar,
  	"groups_text_en" varchar,
  	"trials_title" varchar,
  	"trials_title_en" varchar,
  	"trials_text" varchar,
  	"trials_text_en" varchar,
  	"trials_cta" varchar,
  	"trials_cta_en" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "academy_content_groups" ADD CONSTRAINT "academy_content_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academy_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "academy_content_groups_order_idx" ON "academy_content_groups" USING btree ("_order");
  CREATE INDEX "academy_content_groups_parent_id_idx" ON "academy_content_groups" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "academy_content_groups" CASCADE;
  DROP TABLE "academy_content" CASCADE;`)
}
