import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Baseline for a database that predates tracked migrations: its schema was
  // created by Payload's dev `push` and verified identical to this snapshot
  // (2026-10-21) before this file was committed. On that database this is a
  // no-op that just records the baseline; on a fresh, empty database it
  // creates the full schema.
  const existing = await db.execute(sql`SELECT to_regclass('public.users') AS t`);
  if ((existing.rows[0] as { t: string | null } | undefined)?.t) {
    payload.logger.info("baseline: schema already present (push-created), recording only");
    return;
  }

  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'club_admin');
  CREATE TYPE "public"."enum_seasons_status" AS ENUM('draft', 'active', 'archived');
  CREATE TYPE "public"."enum_teams_category" AS ENUM('men', 'women', 'futsal', 'youth', 'academy', 'veterans', 'other');
  CREATE TYPE "public"."enum_teams_status" AS ENUM('active', 'inactive', 'archived');
  CREATE TYPE "public"."enum_clubs_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_leagues_type" AS ENUM('league', 'cup', 'friendly', 'tournament', 'other');
  CREATE TYPE "public"."enum_leagues_category" AS ENUM('men', 'women', 'futsal', 'youth', 'mixed', 'other');
  CREATE TYPE "public"."enum_players_position" AS ENUM('goalkeeper', 'defender', 'midfielder', 'forward');
  CREATE TYPE "public"."enum_players_preferred_foot" AS ENUM('right', 'left', 'both');
  CREATE TYPE "public"."enum_players_status" AS ENUM('active', 'inactive', 'transferred', 'retired');
  CREATE TYPE "public"."enum_rosters_position" AS ENUM('goalkeeper', 'defender', 'midfielder', 'forward');
  CREATE TYPE "public"."enum_rosters_status" AS ENUM('active', 'loaned', 'transferred', 'injured', 'inactive');
  CREATE TYPE "public"."enum_venues_type" AS ENUM('stadium', 'training_ground', 'indoor', 'other');
  CREATE TYPE "public"."enum_venues_surface" AS ENUM('natural_grass', 'artificial_turf', 'parquet', 'concrete', 'other');
  CREATE TYPE "public"."enum_matches_events_type" AS ENUM('goal', 'yellow_card', 'red_card', 'substitution', 'own_goal', 'penalty_saved');
  CREATE TYPE "public"."enum_matches_match_type" AS ENUM('league', 'cup', 'friendly', 'tournament', 'playoff', 'other');
  CREATE TYPE "public"."enum_matches_status" AS ENUM('scheduled', 'live', 'completed', 'postponed', 'cancelled', 'draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_staff_status" AS ENUM('active', 'inactive', 'archived');
  CREATE TYPE "public"."enum_staff_assignments_status" AS ENUM('active', 'completed', 'inactive');
  CREATE TYPE "public"."enum_club_info_sponsors_tier" AS ENUM('principal', 'official', 'partner');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'club_admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"start_year" numeric NOT NULL,
  	"end_year" numeric NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"is_current" boolean DEFAULT false,
  	"status" "enum_seasons_status" DEFAULT 'draft' NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_en" varchar,
  	"slug" varchar NOT NULL,
  	"category" "enum_teams_category" NOT NULL,
  	"age_group" varchar,
  	"description" jsonb,
  	"logo_id" integer,
  	"hero_image_id" integer,
  	"status" "enum_teams_status" DEFAULT 'active' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clubs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_en" varchar,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"status" "enum_clubs_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leagues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_en" varchar,
  	"slug" varchar NOT NULL,
  	"type" "enum_leagues_type" DEFAULT 'league' NOT NULL,
  	"category" "enum_leagues_category" NOT NULL,
  	"organizer" varchar,
  	"country" varchar DEFAULT 'Ελλάδα',
  	"region" varchar,
  	"level" varchar,
  	"logo_id" integer,
  	"website_url" varchar,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "players_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "players" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"first_name_en" varchar,
  	"last_name_en" varchar,
  	"full_name" varchar,
  	"slug" varchar NOT NULL,
  	"display_name" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"nationality" varchar DEFAULT 'Ελληνική',
  	"nationality_en" varchar DEFAULT 'Greek',
  	"position" "enum_players_position" NOT NULL,
  	"preferred_foot" "enum_players_preferred_foot",
  	"height_cm" numeric,
  	"weight_kg" numeric,
  	"default_shirt_number" numeric,
  	"biography" jsonb,
  	"biography_en" jsonb,
  	"profile_image_id" integer,
  	"social_links_instagram" varchar,
  	"social_links_twitter" varchar,
  	"social_links_facebook" varchar,
  	"featured" boolean DEFAULT false,
  	"status" "enum_players_status" DEFAULT 'active' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rosters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"season_id" integer NOT NULL,
  	"team_id" integer NOT NULL,
  	"player_id" integer NOT NULL,
  	"league_id" integer,
  	"shirt_number" numeric,
  	"position" "enum_rosters_position",
  	"is_captain" boolean DEFAULT false,
  	"is_vice_captain" boolean DEFAULT false,
  	"joined_date" timestamp(3) with time zone,
  	"left_date" timestamp(3) with time zone,
  	"status" "enum_rosters_status" DEFAULT 'active' NOT NULL,
  	"stats_appearances" numeric DEFAULT 0,
  	"stats_goals" numeric DEFAULT 0,
  	"stats_assists" numeric DEFAULT 0,
  	"stats_yellow_cards" numeric DEFAULT 0,
  	"stats_red_cards" numeric DEFAULT 0,
  	"stats_minutes_played" numeric DEFAULT 0,
  	"stats_clean_sheets" numeric,
  	"notes" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "venues_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_en" varchar,
  	"slug" varchar NOT NULL,
  	"type" "enum_venues_type" DEFAULT 'stadium' NOT NULL,
  	"address" varchar,
  	"city" varchar DEFAULT 'Πύργος',
  	"region" varchar,
  	"country" varchar DEFAULT 'Ελλάδα',
  	"postal_code" varchar,
  	"google_maps_url" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"capacity" numeric,
  	"surface" "enum_venues_surface",
  	"description" jsonb,
  	"main_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "matches_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "matches_starting_lineup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"player_id" integer NOT NULL,
  	"shirt_number" numeric,
  	"position" varchar
  );
  
  CREATE TABLE "matches_bench" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"player_id" integer NOT NULL,
  	"shirt_number" numeric
  );
  
  CREATE TABLE "matches_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_matches_events_type" NOT NULL,
  	"minute" numeric,
  	"player_id" integer,
  	"player_out_id" integer,
  	"notes" varchar
  );
  
  CREATE TABLE "matches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"season_id" integer NOT NULL,
  	"team_id" integer NOT NULL,
  	"league_id" integer NOT NULL,
  	"venue_id" integer,
  	"opponent_club_id" integer,
  	"match_type" "enum_matches_match_type" DEFAULT 'league' NOT NULL,
  	"home_team_name" varchar NOT NULL,
  	"away_team_name" varchar NOT NULL,
  	"home_team_name_en" varchar,
  	"away_team_name_en" varchar,
  	"home_team_internal_id" integer,
  	"away_team_internal_id" integer,
  	"is_home_match" boolean DEFAULT true,
  	"home_score" numeric,
  	"away_score" numeric,
  	"match_date" timestamp(3) with time zone NOT NULL,
  	"kickoff_time" varchar,
  	"matchweek" varchar,
  	"matchweek_en" varchar,
  	"status" "enum_matches_status" DEFAULT 'scheduled' NOT NULL,
  	"ticket_url" varchar,
  	"livestream_url" varchar,
  	"match_preview" jsonb,
  	"match_report" jsonb,
  	"featured_image_id" integer,
  	"referee" varchar,
  	"attendance" numeric,
  	"weather_notes" varchar,
  	"player_of_the_match_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "league_tables_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"is_pyrgos" boolean DEFAULT false,
  	"club_id" integer,
  	"played" numeric DEFAULT 0,
  	"won" numeric DEFAULT 0,
  	"drawn" numeric DEFAULT 0,
  	"lost" numeric DEFAULT 0,
  	"goals_for" numeric DEFAULT 0,
  	"goals_against" numeric DEFAULT 0,
  	"points" numeric DEFAULT 0,
  	"notes" varchar
  );
  
  CREATE TABLE "league_tables" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"season_id" integer NOT NULL,
  	"league_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_en" varchar,
  	"slug" varchar NOT NULL,
  	"color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "news_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"excerpt_en" varchar,
  	"content" jsonb,
  	"content_en" jsonb,
  	"featured_image_id" integer,
  	"category_id" integer,
  	"author" varchar DEFAULT 'Ομάδα Επικοινωνίας',
  	"author_en" varchar DEFAULT 'Club Media Team',
  	"published_date" timestamp(3) with time zone,
  	"status" "enum_news_status" DEFAULT 'draft',
  	"reading_time" numeric DEFAULT 3,
  	"featured" boolean DEFAULT false,
  	"related_team_id" integer,
  	"related_season_id" integer,
  	"related_match_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_og_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"players_id" integer
  );
  
  CREATE TABLE "_news_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_title_en" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_excerpt_en" varchar,
  	"version_content" jsonb,
  	"version_content_en" jsonb,
  	"version_featured_image_id" integer,
  	"version_category_id" integer,
  	"version_author" varchar DEFAULT 'Ομάδα Επικοινωνίας',
  	"version_author_en" varchar DEFAULT 'Club Media Team',
  	"version_published_date" timestamp(3) with time zone,
  	"version_status" "enum__news_v_version_status" DEFAULT 'draft',
  	"version_reading_time" numeric DEFAULT 3,
  	"version_featured" boolean DEFAULT false,
  	"version_related_team_id" integer,
  	"version_related_season_id" integer,
  	"version_related_match_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_og_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"players_id" integer
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"first_name_en" varchar,
  	"last_name_en" varchar,
  	"full_name" varchar,
  	"slug" varchar NOT NULL,
  	"role_title" varchar,
  	"role_title_en" varchar,
  	"specialty" varchar,
  	"specialty_en" varchar,
  	"years_of_experience" numeric,
  	"biography" jsonb,
  	"biography_en" jsonb,
  	"profile_image_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar,
  	"social_links_instagram" varchar,
  	"status" "enum_staff_status" DEFAULT 'active' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "staff_assignments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"staff_id" integer NOT NULL,
  	"team_id" integer NOT NULL,
  	"season_id" integer NOT NULL,
  	"role_for_season" varchar,
  	"role_for_season_en" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"status" "enum_staff_assignments_status" DEFAULT 'active' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"seasons_id" integer,
  	"teams_id" integer,
  	"clubs_id" integer,
  	"leagues_id" integer,
  	"players_id" integer,
  	"rosters_id" integer,
  	"venues_id" integer,
  	"matches_id" integer,
  	"league_tables_id" integer,
  	"news_categories_id" integer,
  	"news_id" integer,
  	"staff_id" integer,
  	"staff_assignments_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'PYRGOS AFC',
  	"site_url" varchar DEFAULT 'https://pyrgosafc.example.com',
  	"maintenance_mode" boolean DEFAULT false,
  	"bilingual_enabled" boolean DEFAULT true,
  	"default_seo_title" varchar DEFAULT 'PYRGOS AFC — Επίσημος Ιστότοπος',
  	"default_seo_description" varchar DEFAULT 'Επίσημος ιστότοπος του PYRGOS AFC. Αγώνες, νέα, παίκτες και πολλά ακόμα.',
  	"default_og_image_id" integer,
  	"google_analytics_id" varchar,
  	"cookie_banner_enabled" boolean DEFAULT true,
  	"nav_announcement_bar" varchar,
  	"nav_announcement_bar_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "club_info_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"title_en" varchar,
  	"description" varchar,
  	"description_en" varchar
  );
  
  CREATE TABLE "club_info_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tier" "enum_club_info_sponsors_tier" NOT NULL,
  	"tagline" varchar,
  	"tagline_en" varchar,
  	"url" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "club_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'PYRGOS AFC',
  	"name_en" varchar DEFAULT 'PYRGOS AFC',
  	"short_name" varchar DEFAULT 'PAFC',
  	"founded" numeric DEFAULT 2026,
  	"logo_id" integer,
  	"colors_primary" varchar DEFAULT '#dc2626',
  	"colors_secondary" varchar DEFAULT '#0a0a0a',
  	"colors_accent" varchar DEFAULT '#ffffff',
  	"stadium_name" varchar DEFAULT 'Στάδιο Πύργου',
  	"stadium_name_en" varchar DEFAULT 'Pyrgos Stadium',
  	"stadium_capacity" varchar DEFAULT '12.500',
  	"stadium_opened" numeric DEFAULT 2026,
  	"contact_email" varchar DEFAULT 'hello@pyrgosafc.com',
  	"contact_phone" varchar DEFAULT '+30 26210 00000',
  	"contact_address" varchar DEFAULT 'Λεωφόρος Πύργου 1, Πύργος',
  	"contact_address_en" varchar DEFAULT '1 Tower Hill Avenue, Pyrgos, Greece',
  	"contact_city" varchar DEFAULT 'Πύργος',
  	"contact_postal_code" varchar,
  	"social_media_instagram" varchar,
  	"social_media_twitter" varchar,
  	"social_media_facebook" varchar,
  	"social_media_youtube" varchar,
  	"social_media_tiktok" varchar,
  	"about" jsonb,
  	"about_en" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_template" varchar DEFAULT '%s | PYRGOS AFC',
  	"default_title" varchar DEFAULT 'PYRGOS AFC — Επίσημος Ιστότοπος',
  	"default_description" varchar DEFAULT 'Επίσημος ιστότοπος του PYRGOS AFC. Αγώνες, νέα, παίκτες, ακαδημία και πολλά ακόμα.',
  	"default_og_image_id" integer,
  	"twitter_handle" varchar DEFAULT '@pyrgosafc',
  	"robots_index" boolean DEFAULT true,
  	"robots_follow" boolean DEFAULT true,
  	"robots_additional_directives" varchar,
  	"structured_data_organization_name" varchar DEFAULT 'PYRGOS AFC',
  	"structured_data_organization_url" varchar DEFAULT 'https://pyrgosafc.example.com',
  	"structured_data_organization_logo_id" integer,
  	"structured_data_founding_year" numeric DEFAULT 2026,
  	"structured_data_sport" varchar DEFAULT 'Football',
  	"structured_data_location" varchar DEFAULT 'Pyrgos, Greece',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title1" varchar,
  	"hero_title1_en" varchar,
  	"hero_title_accent" varchar,
  	"hero_title_accent_en" varchar,
  	"hero_title2" varchar,
  	"hero_title2_en" varchar,
  	"hero_text" varchar,
  	"hero_text_en" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_content_story_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar,
  	"title_en" varchar,
  	"text" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE "about_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title1" varchar,
  	"hero_title1_en" varchar,
  	"hero_title_accent" varchar,
  	"hero_title_accent_en" varchar,
  	"hero_hero_text" varchar,
  	"hero_hero_text_en" varchar,
  	"mission_mission_eyebrow" varchar,
  	"mission_mission_eyebrow_en" varchar,
  	"mission_mission_title" varchar,
  	"mission_mission_title_en" varchar,
  	"mission_mission1" varchar,
  	"mission_mission1_en" varchar,
  	"mission_mission2" varchar,
  	"mission_mission2_en" varchar,
  	"mission_mission3" varchar,
  	"mission_mission3_en" varchar,
  	"stats_founded" varchar,
  	"stats_players" varchar,
  	"stats_groups" varchar,
  	"stats_capacity" varchar,
  	"story_story_eyebrow" varchar,
  	"story_story_eyebrow_en" varchar,
  	"story_story_title" varchar,
  	"story_story_title_en" varchar,
  	"story_story_text" varchar,
  	"story_story_text_en" varchar,
  	"stadium_stadium_eyebrow" varchar,
  	"stadium_stadium_eyebrow_en" varchar,
  	"stadium_stadium_title" varchar,
  	"stadium_stadium_title_en" varchar,
  	"stadium_stadium_text" varchar,
  	"stadium_stadium_text_en" varchar,
  	"fans_fans_eyebrow" varchar,
  	"fans_fans_eyebrow_en" varchar,
  	"fans_fans_title" varchar,
  	"fans_fans_title_en" varchar,
  	"fans_fans_text" varchar,
  	"fans_fans_text_en" varchar,
  	"fans_fans1" varchar,
  	"fans_fans1_en" varchar,
  	"fans_fans2" varchar,
  	"fans_fans2_en" varchar,
  	"quote_text" varchar,
  	"quote_text_en" varchar,
  	"quote_name" varchar,
  	"quote_name_en" varchar,
  	"quote_role" varchar,
  	"quote_role_en" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_eyebrow_en" varchar,
  	"hero_title1" varchar,
  	"hero_title1_en" varchar,
  	"hero_title_accent" varchar,
  	"hero_title_accent_en" varchar,
  	"hero_text" varchar,
  	"hero_text_en" varchar,
  	"departments_general_title" varchar,
  	"departments_general_title_en" varchar,
  	"departments_general_text" varchar,
  	"departments_general_text_en" varchar,
  	"departments_general_email" varchar,
  	"departments_media_title" varchar,
  	"departments_media_title_en" varchar,
  	"departments_media_text" varchar,
  	"departments_media_text_en" varchar,
  	"departments_media_email" varchar,
  	"departments_sponsorships_title" varchar,
  	"departments_sponsorships_title_en" varchar,
  	"departments_sponsorships_text" varchar,
  	"departments_sponsorships_text_en" varchar,
  	"departments_sponsorships_email" varchar,
  	"departments_academy_title" varchar,
  	"departments_academy_title_en" varchar,
  	"departments_academy_text" varchar,
  	"departments_academy_text_en" varchar,
  	"departments_academy_email" varchar,
  	"form_form_eyebrow" varchar,
  	"form_form_eyebrow_en" varchar,
  	"form_form_title" varchar,
  	"form_form_title_en" varchar,
  	"form_form_text" varchar,
  	"form_form_text_en" varchar,
  	"details_details_eyebrow" varchar,
  	"details_details_eyebrow_en" varchar,
  	"details_details_title" varchar,
  	"details_details_title_en" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teams" ADD CONSTRAINT "teams_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams" ADD CONSTRAINT "teams_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teams" ADD CONSTRAINT "teams_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clubs" ADD CONSTRAINT "clubs_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leagues" ADD CONSTRAINT "leagues_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players_gallery" ADD CONSTRAINT "players_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players_gallery" ADD CONSTRAINT "players_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rosters" ADD CONSTRAINT "rosters_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rosters" ADD CONSTRAINT "rosters_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rosters" ADD CONSTRAINT "rosters_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rosters" ADD CONSTRAINT "rosters_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_gallery" ADD CONSTRAINT "venues_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_gallery" ADD CONSTRAINT "venues_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_gallery" ADD CONSTRAINT "matches_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_gallery" ADD CONSTRAINT "matches_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "matches_starting_lineup" ADD CONSTRAINT "matches_starting_lineup_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_starting_lineup" ADD CONSTRAINT "matches_starting_lineup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "matches_bench" ADD CONSTRAINT "matches_bench_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_bench" ADD CONSTRAINT "matches_bench_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "matches_events" ADD CONSTRAINT "matches_events_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_events" ADD CONSTRAINT "matches_events_player_out_id_players_id_fk" FOREIGN KEY ("player_out_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches_events" ADD CONSTRAINT "matches_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_opponent_club_id_clubs_id_fk" FOREIGN KEY ("opponent_club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_internal_id_teams_id_fk" FOREIGN KEY ("home_team_internal_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_internal_id_teams_id_fk" FOREIGN KEY ("away_team_internal_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_player_of_the_match_id_players_id_fk" FOREIGN KEY ("player_of_the_match_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "matches" ADD CONSTRAINT "matches_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "league_tables_rows" ADD CONSTRAINT "league_tables_rows_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "league_tables_rows" ADD CONSTRAINT "league_tables_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."league_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "league_tables" ADD CONSTRAINT "league_tables_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "league_tables" ADD CONSTRAINT "league_tables_league_id_leagues_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_tags" ADD CONSTRAINT "news_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_category_id_news_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."news_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_related_team_id_teams_id_fk" FOREIGN KEY ("related_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_related_season_id_seasons_id_fk" FOREIGN KEY ("related_season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_related_match_id_matches_id_fk" FOREIGN KEY ("related_match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_players_fk" FOREIGN KEY ("players_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_tags" ADD CONSTRAINT "_news_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_category_id_news_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."news_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_related_team_id_teams_id_fk" FOREIGN KEY ("version_related_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_related_season_id_seasons_id_fk" FOREIGN KEY ("version_related_season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_related_match_id_matches_id_fk" FOREIGN KEY ("version_related_match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_meta_og_image_id_media_id_fk" FOREIGN KEY ("version_meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_players_fk" FOREIGN KEY ("players_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_assignments" ADD CONSTRAINT "staff_assignments_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_assignments" ADD CONSTRAINT "staff_assignments_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_assignments" ADD CONSTRAINT "staff_assignments_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teams_fk" FOREIGN KEY ("teams_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clubs_fk" FOREIGN KEY ("clubs_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leagues_fk" FOREIGN KEY ("leagues_id") REFERENCES "public"."leagues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_players_fk" FOREIGN KEY ("players_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rosters_fk" FOREIGN KEY ("rosters_id") REFERENCES "public"."rosters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_matches_fk" FOREIGN KEY ("matches_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_league_tables_fk" FOREIGN KEY ("league_tables_id") REFERENCES "public"."league_tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_assignments_fk" FOREIGN KEY ("staff_assignments_id") REFERENCES "public"."staff_assignments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "club_info_values" ADD CONSTRAINT "club_info_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."club_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "club_info_sponsors" ADD CONSTRAINT "club_info_sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "club_info_sponsors" ADD CONSTRAINT "club_info_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."club_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "club_info" ADD CONSTRAINT "club_info_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_structured_data_organization_logo_id_media_id_fk" FOREIGN KEY ("structured_data_organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_content_story_timeline" ADD CONSTRAINT "about_content_story_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "seasons_title_idx" ON "seasons" USING btree ("title");
  CREATE UNIQUE INDEX "seasons_slug_idx" ON "seasons" USING btree ("slug");
  CREATE INDEX "seasons_updated_at_idx" ON "seasons" USING btree ("updated_at");
  CREATE INDEX "seasons_created_at_idx" ON "seasons" USING btree ("created_at");
  CREATE UNIQUE INDEX "teams_slug_idx" ON "teams" USING btree ("slug");
  CREATE INDEX "teams_logo_idx" ON "teams" USING btree ("logo_id");
  CREATE INDEX "teams_hero_image_idx" ON "teams" USING btree ("hero_image_id");
  CREATE INDEX "teams_meta_meta_og_image_idx" ON "teams" USING btree ("meta_og_image_id");
  CREATE INDEX "teams_updated_at_idx" ON "teams" USING btree ("updated_at");
  CREATE INDEX "teams_created_at_idx" ON "teams" USING btree ("created_at");
  CREATE UNIQUE INDEX "clubs_slug_idx" ON "clubs" USING btree ("slug");
  CREATE INDEX "clubs_logo_idx" ON "clubs" USING btree ("logo_id");
  CREATE INDEX "clubs_updated_at_idx" ON "clubs" USING btree ("updated_at");
  CREATE INDEX "clubs_created_at_idx" ON "clubs" USING btree ("created_at");
  CREATE UNIQUE INDEX "leagues_slug_idx" ON "leagues" USING btree ("slug");
  CREATE INDEX "leagues_logo_idx" ON "leagues" USING btree ("logo_id");
  CREATE INDEX "leagues_updated_at_idx" ON "leagues" USING btree ("updated_at");
  CREATE INDEX "leagues_created_at_idx" ON "leagues" USING btree ("created_at");
  CREATE INDEX "players_gallery_order_idx" ON "players_gallery" USING btree ("_order");
  CREATE INDEX "players_gallery_parent_id_idx" ON "players_gallery" USING btree ("_parent_id");
  CREATE INDEX "players_gallery_image_idx" ON "players_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "players_slug_idx" ON "players" USING btree ("slug");
  CREATE INDEX "players_profile_image_idx" ON "players" USING btree ("profile_image_id");
  CREATE INDEX "players_meta_meta_og_image_idx" ON "players" USING btree ("meta_og_image_id");
  CREATE INDEX "players_updated_at_idx" ON "players" USING btree ("updated_at");
  CREATE INDEX "players_created_at_idx" ON "players" USING btree ("created_at");
  CREATE INDEX "rosters_season_idx" ON "rosters" USING btree ("season_id");
  CREATE INDEX "rosters_team_idx" ON "rosters" USING btree ("team_id");
  CREATE INDEX "rosters_player_idx" ON "rosters" USING btree ("player_id");
  CREATE INDEX "rosters_league_idx" ON "rosters" USING btree ("league_id");
  CREATE INDEX "rosters_updated_at_idx" ON "rosters" USING btree ("updated_at");
  CREATE INDEX "rosters_created_at_idx" ON "rosters" USING btree ("created_at");
  CREATE INDEX "venues_gallery_order_idx" ON "venues_gallery" USING btree ("_order");
  CREATE INDEX "venues_gallery_parent_id_idx" ON "venues_gallery" USING btree ("_parent_id");
  CREATE INDEX "venues_gallery_image_idx" ON "venues_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "venues_slug_idx" ON "venues" USING btree ("slug");
  CREATE INDEX "venues_main_image_idx" ON "venues" USING btree ("main_image_id");
  CREATE INDEX "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE INDEX "matches_gallery_order_idx" ON "matches_gallery" USING btree ("_order");
  CREATE INDEX "matches_gallery_parent_id_idx" ON "matches_gallery" USING btree ("_parent_id");
  CREATE INDEX "matches_gallery_image_idx" ON "matches_gallery" USING btree ("image_id");
  CREATE INDEX "matches_starting_lineup_order_idx" ON "matches_starting_lineup" USING btree ("_order");
  CREATE INDEX "matches_starting_lineup_parent_id_idx" ON "matches_starting_lineup" USING btree ("_parent_id");
  CREATE INDEX "matches_starting_lineup_player_idx" ON "matches_starting_lineup" USING btree ("player_id");
  CREATE INDEX "matches_bench_order_idx" ON "matches_bench" USING btree ("_order");
  CREATE INDEX "matches_bench_parent_id_idx" ON "matches_bench" USING btree ("_parent_id");
  CREATE INDEX "matches_bench_player_idx" ON "matches_bench" USING btree ("player_id");
  CREATE INDEX "matches_events_order_idx" ON "matches_events" USING btree ("_order");
  CREATE INDEX "matches_events_parent_id_idx" ON "matches_events" USING btree ("_parent_id");
  CREATE INDEX "matches_events_player_idx" ON "matches_events" USING btree ("player_id");
  CREATE INDEX "matches_events_player_out_idx" ON "matches_events" USING btree ("player_out_id");
  CREATE INDEX "matches_season_idx" ON "matches" USING btree ("season_id");
  CREATE INDEX "matches_team_idx" ON "matches" USING btree ("team_id");
  CREATE INDEX "matches_league_idx" ON "matches" USING btree ("league_id");
  CREATE INDEX "matches_venue_idx" ON "matches" USING btree ("venue_id");
  CREATE INDEX "matches_opponent_club_idx" ON "matches" USING btree ("opponent_club_id");
  CREATE INDEX "matches_home_team_internal_idx" ON "matches" USING btree ("home_team_internal_id");
  CREATE INDEX "matches_away_team_internal_idx" ON "matches" USING btree ("away_team_internal_id");
  CREATE INDEX "matches_featured_image_idx" ON "matches" USING btree ("featured_image_id");
  CREATE INDEX "matches_player_of_the_match_idx" ON "matches" USING btree ("player_of_the_match_id");
  CREATE INDEX "matches_meta_meta_og_image_idx" ON "matches" USING btree ("meta_og_image_id");
  CREATE INDEX "matches_updated_at_idx" ON "matches" USING btree ("updated_at");
  CREATE INDEX "matches_created_at_idx" ON "matches" USING btree ("created_at");
  CREATE INDEX "league_tables_rows_order_idx" ON "league_tables_rows" USING btree ("_order");
  CREATE INDEX "league_tables_rows_parent_id_idx" ON "league_tables_rows" USING btree ("_parent_id");
  CREATE INDEX "league_tables_rows_club_idx" ON "league_tables_rows" USING btree ("club_id");
  CREATE INDEX "league_tables_season_idx" ON "league_tables" USING btree ("season_id");
  CREATE INDEX "league_tables_league_idx" ON "league_tables" USING btree ("league_id");
  CREATE INDEX "league_tables_updated_at_idx" ON "league_tables" USING btree ("updated_at");
  CREATE INDEX "league_tables_created_at_idx" ON "league_tables" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_categories_slug_idx" ON "news_categories" USING btree ("slug");
  CREATE INDEX "news_categories_updated_at_idx" ON "news_categories" USING btree ("updated_at");
  CREATE INDEX "news_categories_created_at_idx" ON "news_categories" USING btree ("created_at");
  CREATE INDEX "news_gallery_order_idx" ON "news_gallery" USING btree ("_order");
  CREATE INDEX "news_gallery_parent_id_idx" ON "news_gallery" USING btree ("_parent_id");
  CREATE INDEX "news_gallery_image_idx" ON "news_gallery" USING btree ("image_id");
  CREATE INDEX "news_tags_order_idx" ON "news_tags" USING btree ("_order");
  CREATE INDEX "news_tags_parent_id_idx" ON "news_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_featured_image_idx" ON "news" USING btree ("featured_image_id");
  CREATE INDEX "news_category_idx" ON "news" USING btree ("category_id");
  CREATE INDEX "news_related_team_idx" ON "news" USING btree ("related_team_id");
  CREATE INDEX "news_related_season_idx" ON "news" USING btree ("related_season_id");
  CREATE INDEX "news_related_match_idx" ON "news" USING btree ("related_match_id");
  CREATE INDEX "news_meta_meta_og_image_idx" ON "news" USING btree ("meta_og_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_players_id_idx" ON "news_rels" USING btree ("players_id");
  CREATE INDEX "_news_v_version_gallery_order_idx" ON "_news_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_news_v_version_gallery_parent_id_idx" ON "_news_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_gallery_image_idx" ON "_news_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_news_v_version_tags_order_idx" ON "_news_v_version_tags" USING btree ("_order");
  CREATE INDEX "_news_v_version_tags_parent_id_idx" ON "_news_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_featured_image_idx" ON "_news_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_news_v_version_version_category_idx" ON "_news_v" USING btree ("version_category_id");
  CREATE INDEX "_news_v_version_version_related_team_idx" ON "_news_v" USING btree ("version_related_team_id");
  CREATE INDEX "_news_v_version_version_related_season_idx" ON "_news_v" USING btree ("version_related_season_id");
  CREATE INDEX "_news_v_version_version_related_match_idx" ON "_news_v" USING btree ("version_related_match_id");
  CREATE INDEX "_news_v_version_meta_version_meta_og_image_idx" ON "_news_v" USING btree ("version_meta_og_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_players_id_idx" ON "_news_v_rels" USING btree ("players_id");
  CREATE UNIQUE INDEX "staff_slug_idx" ON "staff" USING btree ("slug");
  CREATE INDEX "staff_profile_image_idx" ON "staff" USING btree ("profile_image_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE INDEX "staff_assignments_staff_idx" ON "staff_assignments" USING btree ("staff_id");
  CREATE INDEX "staff_assignments_team_idx" ON "staff_assignments" USING btree ("team_id");
  CREATE INDEX "staff_assignments_season_idx" ON "staff_assignments" USING btree ("season_id");
  CREATE INDEX "staff_assignments_updated_at_idx" ON "staff_assignments" USING btree ("updated_at");
  CREATE INDEX "staff_assignments_created_at_idx" ON "staff_assignments" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("seasons_id");
  CREATE INDEX "payload_locked_documents_rels_teams_id_idx" ON "payload_locked_documents_rels" USING btree ("teams_id");
  CREATE INDEX "payload_locked_documents_rels_clubs_id_idx" ON "payload_locked_documents_rels" USING btree ("clubs_id");
  CREATE INDEX "payload_locked_documents_rels_leagues_id_idx" ON "payload_locked_documents_rels" USING btree ("leagues_id");
  CREATE INDEX "payload_locked_documents_rels_players_id_idx" ON "payload_locked_documents_rels" USING btree ("players_id");
  CREATE INDEX "payload_locked_documents_rels_rosters_id_idx" ON "payload_locked_documents_rels" USING btree ("rosters_id");
  CREATE INDEX "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  CREATE INDEX "payload_locked_documents_rels_matches_id_idx" ON "payload_locked_documents_rels" USING btree ("matches_id");
  CREATE INDEX "payload_locked_documents_rels_league_tables_id_idx" ON "payload_locked_documents_rels" USING btree ("league_tables_id");
  CREATE INDEX "payload_locked_documents_rels_news_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("news_categories_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_staff_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_assignments_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "club_info_values_order_idx" ON "club_info_values" USING btree ("_order");
  CREATE INDEX "club_info_values_parent_id_idx" ON "club_info_values" USING btree ("_parent_id");
  CREATE INDEX "club_info_sponsors_order_idx" ON "club_info_sponsors" USING btree ("_order");
  CREATE INDEX "club_info_sponsors_parent_id_idx" ON "club_info_sponsors" USING btree ("_parent_id");
  CREATE INDEX "club_info_sponsors_logo_idx" ON "club_info_sponsors" USING btree ("logo_id");
  CREATE INDEX "club_info_logo_idx" ON "club_info" USING btree ("logo_id");
  CREATE INDEX "seo_defaults_default_og_image_idx" ON "seo_defaults" USING btree ("default_og_image_id");
  CREATE INDEX "seo_defaults_structured_data_structured_data_organizatio_idx" ON "seo_defaults" USING btree ("structured_data_organization_logo_id");
  CREATE INDEX "about_content_story_timeline_order_idx" ON "about_content_story_timeline" USING btree ("_order");
  CREATE INDEX "about_content_story_timeline_parent_id_idx" ON "about_content_story_timeline" USING btree ("_parent_id");`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Rolling back the baseline would DROP every table (all site data). Refuse;
  // restore from a database backup instead if that is really intended.
  throw new Error("Refusing to roll back the baseline migration: it would drop the entire schema.");
}
