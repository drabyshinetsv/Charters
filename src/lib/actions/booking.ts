"use server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { bookingSchema, type BookingFormData } from "@/lib/schemas/booking";
import { sendBookingEmails } from "@/lib/email";
import { getDateUnavailableMessage } from "@/lib/booking-availability";
import { sql } from "drizzle-orm";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const nested = error as Error & {
      cause?: unknown;
      detail?: string;
      hint?: string;
      where?: string;
    };

    const parts = [nested.message];
    if (typeof nested.detail === "string" && nested.detail) parts.push(nested.detail);
    if (typeof nested.hint === "string" && nested.hint) parts.push(nested.hint);
    if (typeof nested.where === "string" && nested.where) parts.push(nested.where);

    if (nested.cause && typeof nested.cause === "object") {
      const cause = nested.cause as {
        message?: string;
        detail?: string;
        hint?: string;
        where?: string;
      };
      if (cause.message) parts.push(cause.message);
      if (cause.detail) parts.push(cause.detail);
      if (cause.hint) parts.push(cause.hint);
      if (cause.where) parts.push(cause.where);
    }

    return parts.filter(Boolean).join(" | ");
  }
  if (typeof error === "string") return error;
  return "Unknown error";
}

function mapDbErrorToUserMessage(dbMessage: string): string {
  const normalized = dbMessage.toLowerCase();

  if (normalized.includes("charter_type") && normalized.includes("enum")) {
    return "Your database still has old charter type options. Please run the latest database migration, then try again.";
  }

  if (normalized.includes("departure_location") && normalized.includes("enum")) {
    return "Departure location value is not accepted by the current database enum. Please update database migrations.";
  }

  if (
    normalized.includes("column") &&
    (normalized.includes("charter_type") ||
      normalized.includes("charter_end_date") ||
      normalized.includes("cruising_destination") ||
      normalized.includes("departure_location") ||
      normalized.includes("contact_method_whatsapp") ||
      normalized.includes("purpose_leisure"))
  ) {
    return "Booking table columns are out of sync with this app version. Please run the latest database migration.";
  }

  if (
    (normalized.includes("null value") || normalized.includes("not-null constraint")) &&
    (normalized.includes("charter_type") || normalized.includes("departure_location"))
  ) {
    return "A required booking field was empty. Please choose both a charter type and departure location.";
  }

  if (
    (normalized.includes("null value") || normalized.includes("not-null constraint")) &&
    (normalized.includes("charter_end_date") || normalized.includes("cruising_destination"))
  ) {
    return "Your production database requires legacy booking fields. Please run the latest migration to update the booking table.";
  }

  if (
    normalized.includes("relation") &&
    normalized.includes("bookings") &&
    normalized.includes("does not exist")
  ) {
    return "The bookings table is missing. Run database migrations, then try again.";
  }

  if (
    normalized.includes("failed query") &&
    (normalized.includes("charter_end_date") ||
      normalized.includes("cruising_destination") ||
      normalized.includes("contact_method_whatsapp"))
  ) {
    return "Your bookings table is on an older schema. Run the latest database migration, then try again.";
  }

  if (
    normalized.includes("failed to connect") ||
    normalized.includes("connect econnrefused") ||
    normalized.includes("connection terminated") ||
    normalized.includes("connection refused")
  ) {
    return "Database connection failed. Check your database connection settings and try again.";
  }

  if (normalized.includes("permission denied") || normalized.includes("row-level security")) {
    return "Database permissions are blocking booking inserts. Please check table permissions or RLS policies.";
  }

  return "We could not submit your booking right now. Please try again.";
}

type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; message: string };

function shouldTryLegacyInsert(dbMessage: string): boolean {
  const normalized = dbMessage.toLowerCase();
  return (
    normalized.includes("charter_end_date") ||
    normalized.includes("cruising_destination") ||
    normalized.includes("contact_method_whatsapp") ||
    normalized.includes("purpose_leisure") ||
    (normalized.includes("column") && normalized.includes("charter_type"))
  );
}

async function runLegacyInsert(d: BookingFormData): Promise<string | null> {
  try {
    const legacyResult = await db.execute<{ id: string }>(sql`
      insert into bookings (
        status,
        full_name,
        email,
        phone,
        contact_method_email,
        contact_method_phone,
        contact_method_whatsapp,
        number_of_guests,
        charter_start_date,
        charter_end_date,
        flexible_dates,
        departure_location,
        cruising_destination,
        purpose_leisure,
        purpose_celebration,
        purpose_corporate,
        purpose_wedding,
        purpose_other,
        purpose_other_desc
      ) values (
        ${"pending"},
        ${d.fullName},
        ${d.email},
        ${d.phone},
        ${d.contactMethodEmail},
        ${d.contactMethodPhone},
        ${false},
        ${d.numberOfGuests},
        ${d.charterStartDate},
        ${d.charterStartDate},
        ${d.flexibleDates},
        ${d.departureLocation},
        ${d.charterType},
        ${false},
        ${d.purposeCelebration},
        ${d.purposeCorporate},
        ${d.purposeWedding},
        ${d.purposeOther},
        ${d.purposeOther ? (d.purposeOtherDesc ?? null) : null}
      )
      returning id
    `);
    return legacyResult[0]?.id ?? null;
  } catch (fullLegacyError) {
    const fullLegacyMessage = getErrorMessage(fullLegacyError).toLowerCase();

    // Some production schemas are "partially legacy" and may miss one of these columns.
    if (
      fullLegacyMessage.includes("column") &&
      (fullLegacyMessage.includes("contact_method_whatsapp") || fullLegacyMessage.includes("purpose_leisure"))
    ) {
      const fallbackResult = await db.execute<{ id: string }>(sql`
        insert into bookings (
          status,
          full_name,
          email,
          phone,
          contact_method_email,
          contact_method_phone,
          number_of_guests,
          charter_start_date,
          charter_end_date,
          flexible_dates,
          departure_location,
          cruising_destination,
          purpose_celebration,
          purpose_corporate,
          purpose_wedding,
          purpose_other,
          purpose_other_desc
        ) values (
          ${"pending"},
          ${d.fullName},
          ${d.email},
          ${d.phone},
          ${d.contactMethodEmail},
          ${d.contactMethodPhone},
          ${d.numberOfGuests},
          ${d.charterStartDate},
          ${d.charterStartDate},
          ${d.flexibleDates},
          ${d.departureLocation},
          ${d.charterType},
          ${d.purposeCelebration},
          ${d.purposeCorporate},
          ${d.purposeWedding},
          ${d.purposeOther},
          ${d.purposeOther ? (d.purposeOtherDesc ?? null) : null}
        )
        returning id
      `);
      return fallbackResult[0]?.id ?? null;
    }

    throw fullLegacyError;
  }
}

export async function createBooking(data: BookingFormData): Promise<CreateBookingResult> {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data" };

  const d = parsed.data;
  const unavailableDateMessage = getDateUnavailableMessage(d.charterStartDate);
  if (unavailableDateMessage) {
    return { success: false, message: unavailableDateMessage };
  }

  const bookingValues = {
    ...d,
    purposeOtherDesc: d.purposeOther ? (d.purposeOtherDesc ?? null) : null,
    status: "pending" as const,
  };

  let result;
  try {
    result = await db.insert(bookings).values(bookingValues).returning({ id: bookings.id });
  } catch (error) {
    const dbMessage = getErrorMessage(error);

    // Backward-compatibility fallback for older production DB enum values.
    if (
      d.charterType === "Daytime Charter" &&
      dbMessage.includes("charter_type") &&
      dbMessage.toLowerCase().includes("enum")
    ) {
      result = await db
        .insert(bookings)
        .values({ ...bookingValues, charterType: "Bachelorette Party" })
        .returning({ id: bookings.id });
    } else if (shouldTryLegacyInsert(dbMessage)) {
      try {
        const legacyId = await runLegacyInsert(d);
        if (!legacyId) {
          return { success: false, message: "Failed to create booking" };
        }

        result = [{ id: legacyId }];
      } catch (legacyError) {
        console.error("Failed to create booking (legacy fallback):", legacyError);
        return { success: false, message: mapDbErrorToUserMessage(getErrorMessage(legacyError)) };
      }
    } else {
      console.error("Failed to create booking:", error);
      return { success: false, message: mapDbErrorToUserMessage(dbMessage) };
    }
  }

  if (!result?.[0]) return { success: false, message: "Failed to create booking" };

  await sendBookingEmails(d, result[0].id).catch((err) => {
    console.error("Failed to send booking emails:", err);
  });

  return { success: true, bookingId: result[0].id };
}
