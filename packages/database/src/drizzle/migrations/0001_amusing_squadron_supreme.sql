CREATE TABLE "drizzle"."post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caption" text,
	"image_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "drizzle"."event_bookmark" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."event_participant" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."event" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."poll_option" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."poll" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."poll_vote" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."question" CASCADE;--> statement-breakpoint
DROP TABLE "drizzle"."question_upvote" CASCADE;--> statement-breakpoint
ALTER TABLE "drizzle"."post" ADD CONSTRAINT "post_image_id_upload_id_fk" FOREIGN KEY ("image_id") REFERENCES "drizzle"."upload"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drizzle"."post" ADD CONSTRAINT "post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "drizzle"."user"("id") ON DELETE cascade ON UPDATE no action;