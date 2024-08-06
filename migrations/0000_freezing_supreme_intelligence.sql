CREATE TABLE IF NOT EXISTS "all_likes_count" (
	"count" integer PRIMARY KEY DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "device_fingerprint" (
	"id" text PRIMARY KEY NOT NULL,
	"screen_width" integer NOT NULL,
	"screen_height" integer NOT NULL,
	"screen_color_depth" integer NOT NULL,
	"screen_pixel_ratio" integer NOT NULL,
	"cpu_hardware_concurrency" integer NOT NULL,
	"device_memory" integer,
	"os_platform" text NOT NULL,
	"browser_language" text NOT NULL,
	"timezone" text NOT NULL,
	"max_touch_points" integer NOT NULL,
	"webgl_vendor" text,
	"webgl_renderer" text,
	"audio_fingerprint" text,
	"fonts" text[] NOT NULL,
	"has_battery" boolean NOT NULL,
	"user_agent" text NOT NULL,
	"ip" text NOT NULL,
	"ip_country" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "real_like_device" (
	"id" text PRIMARY KEY NOT NULL
);
