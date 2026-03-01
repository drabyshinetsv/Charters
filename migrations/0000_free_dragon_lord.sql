CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."departure_location" AS ENUM('Remley''s Point', 'Wappoo Cut Boat Landing', 'Folly River Boat Ramp');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"contact_method_email" boolean DEFAULT false NOT NULL,
	"contact_method_phone" boolean DEFAULT false NOT NULL,
	"contact_method_whatsapp" boolean DEFAULT false NOT NULL,
	"number_of_guests" integer NOT NULL,
	"charter_start_date" text NOT NULL,
	"charter_end_date" text NOT NULL,
	"flexible_dates" boolean DEFAULT false NOT NULL,
	"departure_location" "departure_location" NOT NULL,
	"cruising_destination" text NOT NULL,
	"purpose_leisure" boolean DEFAULT false NOT NULL,
	"purpose_celebration" boolean DEFAULT false NOT NULL,
	"purpose_corporate" boolean DEFAULT false NOT NULL,
	"purpose_wedding" boolean DEFAULT false NOT NULL,
	"purpose_other" boolean DEFAULT false NOT NULL,
	"purpose_other_desc" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
