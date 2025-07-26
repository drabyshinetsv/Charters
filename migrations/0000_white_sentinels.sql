DO $$ BEGIN
  CREATE TYPE "public"."duration_unit" AS ENUM('day', 'week', 'month', 'year');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
CREATE TABLE "dishes" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"price" integer,
	"weight" integer,
	"weight_type" text,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "menu_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text,
	"phone" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"day_of_week" text NOT NULL,
	"opening_time" text NOT NULL,
	"closing_time" text NOT NULL,
	"is_closed" boolean DEFAULT false,
	CONSTRAINT "unique_restaurant_day" UNIQUE("restaurant_id","day_of_week")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subscription_type_id" integer NOT NULL,
	"end_date" timestamp NOT NULL,
	"payment_id" text NOT NULL,
	"payment_status" text NOT NULL,
	"payment_method" text NOT NULL,
	"payment_amount" integer NOT NULL,
	"payment_currency" text NOT NULL,
	"payment_date" timestamp NOT NULL,
	"payment_type" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "subscription_type_abilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"max_restaurants" integer,
	"max_menus" integer,
	"max_menu_categories" integer,
	"max_dishes" integer,
	"max_tables" integer
);
--> statement-breakpoint
CREATE TABLE "subscription_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"features" text[] NOT NULL,
	"duration" "duration_unit" DEFAULT 'month' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"subscription_type_abilities_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"login" text NOT NULL,
	"provider" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"password_hash" text NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "auth_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "permission_table" (
	"permission_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "permission_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_table" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "role_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscription_type_id_subscription_type_id_fk" FOREIGN KEY ("subscription_type_id") REFERENCES "public"."subscription_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_type" ADD CONSTRAINT "subscription_type_subscription_type_abilities_id_subscription_type_abilities_id_fk" FOREIGN KEY ("subscription_type_abilities_id") REFERENCES "public"."subscription_type_abilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_role_table_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role_table"("role_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permission_table_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission_table"("permission_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_role_table_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role_table"("role_id") ON DELETE no action ON UPDATE no action;
