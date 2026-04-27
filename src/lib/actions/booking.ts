"use server";
import { db } from "@/lib/db";
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

type BookingColumnInfo = {
  columnName: string;
  isNullable: "YES" | "NO";
  hasDefault: boolean;
};

async function getBookingColumns(): Promise<BookingColumnInfo[]> {
  return db.execute<BookingColumnInfo>(sql`
    select
      column_name as "columnName",
      is_nullable as "isNullable",
      (column_default is not null) as "hasDefault"
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bookings'
    order by ordinal_position
  `);
}

function buildCandidateValues(d: BookingFormData): Record<string, unknown> {
  const purposeOtherDesc = d.purposeOther ? (d.purposeOtherDesc ?? null) : null;
  return {
    status: "pending",
    full_name: d.fullName,
    email: d.email,
    phone: d.phone,
    contact_method_email: d.contactMethodEmail,
    contact_method_phone: d.contactMethodPhone,
    contact_method_whatsapp: false,
    number_of_guests: d.numberOfGuests,
    charter_start_date: d.charterStartDate,
    charter_end_date: d.charterStartDate,
    flexible_dates: d.flexibleDates,
    charter_type: d.charterType,
    departure_location: d.departureLocation,
    cruising_destination: d.charterType,
    purpose_leisure: false,
    purpose_celebration: d.purposeCelebration,
    purpose_corporate: d.purposeCorporate,
    purpose_wedding: d.purposeWedding,
    purpose_other: d.purposeOther,
    purpose_other_desc: purposeOtherDesc,
  };
}

function getMissingRequiredColumns(columns: BookingColumnInfo[], insertColumns: string[]): string[] {
  const insertSet = new Set(insertColumns);
  return columns
    .filter((column) => column.isNullable === "NO" && !column.hasDefault && !insertSet.has(column.columnName))
    .map((column) => column.columnName);
}

async function runAdaptiveInsert(
  d: BookingFormData,
  withLegacyCharterFallback: boolean,
): Promise<{ id: string } | null> {
  const columns = await getBookingColumns();
  if (!columns.length) throw new Error("Bookings table not found.");

  const tableColumnNames = new Set(columns.map((column) => column.columnName));
  const values = buildCandidateValues(d);

  if (withLegacyCharterFallback && values.charter_type === "Daytime Charter") {
    values.charter_type = "Bachelorette Party";
  }

  const insertColumns = Object.keys(values).filter((key) => tableColumnNames.has(key));
  const missingRequired = getMissingRequiredColumns(columns, insertColumns);
  if (missingRequired.length > 0) {
    throw new Error(`Missing required booking columns: ${missingRequired.join(", ")}`);
  }

  const columnFragments = insertColumns.map((column) => sql.raw(`"${column}"`));
  const valueFragments = insertColumns.map((column) => sql`${values[column]}`);

  const result = await db.execute<{ id: string }>(sql`
    insert into "bookings" (${sql.join(columnFragments, sql`, `)})
    values (${sql.join(valueFragments, sql`, `)})
    returning "id"
  `);

  return result[0] ?? null;
}

export async function createBooking(data: BookingFormData): Promise<CreateBookingResult> {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data" };

  const d = parsed.data;
  const unavailableDateMessage = getDateUnavailableMessage(d.charterStartDate);
  if (unavailableDateMessage) {
    return { success: false, message: unavailableDateMessage };
  }

  try {
    const created = await runAdaptiveInsert(d, false);
    if (!created?.id) {
      return { success: false, message: "Failed to create booking" };
    }

    await sendBookingEmails(d, created.id).catch((err) => {
      console.error("Failed to send booking emails:", err);
    });

    return { success: true, bookingId: created.id };
  } catch (error) {
    const dbMessage = getErrorMessage(error);
    const normalized = dbMessage.toLowerCase();

    if (
      d.charterType === "Daytime Charter" &&
      normalized.includes("charter_type") &&
      normalized.includes("enum")
    ) {
      try {
        const created = await runAdaptiveInsert(d, true);
        if (!created?.id) {
          return { success: false, message: "Failed to create booking" };
        }

        await sendBookingEmails(d, created.id).catch((err) => {
          console.error("Failed to send booking emails:", err);
        });

        return { success: true, bookingId: created.id };
      } catch (retryError) {
        console.error("Failed to create booking after legacy charter fallback:", retryError);
        return { success: false, message: mapDbErrorToUserMessage(getErrorMessage(retryError)) };
      }
    }

    console.error("Failed to create booking:", error);
    return { success: false, message: mapDbErrorToUserMessage(dbMessage) };
  }
}
