import { pgTable, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id:                    uuid("id").primaryKey().defaultRandom(),
  status:                text("status").notNull().default("pending"),
  // Contact
  fullName:              text("full_name").notNull(),
  email:                 text("email").notNull(),
  phone:                 text("phone").notNull(),
  contactMethodEmail:    boolean("contact_method_email").notNull().default(false),
  contactMethodPhone:    boolean("contact_method_phone").notNull().default(false),
  // Charter details
  numberOfGuests:        integer("number_of_guests").notNull(),
  charterStartDate:      text("charter_start_date").notNull(), // ISO "YYYY-MM-DD"
  flexibleDates:         boolean("flexible_dates").notNull().default(false),
  charterType:           text("charter_type").notNull(),
  departureLocation:     text("departure_location").notNull(),
  // Trip preferences
  purposeCelebration:    boolean("purpose_celebration").notNull().default(false),
  purposeCorporate:      boolean("purpose_corporate").notNull().default(false),
  purposeWedding:        boolean("purpose_wedding").notNull().default(false),
  purposeOther:          boolean("purpose_other").notNull().default(false),
  purposeOtherDesc:      text("purpose_other_desc"),
  createdAt:             timestamp("created_at").notNull().defaultNow(),
});

const schema = { bookings };
export default schema;
