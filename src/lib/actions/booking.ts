"use server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { bookingSchema, type BookingFormData } from "@/lib/schemas/booking";
import { sendBookingEmails } from "@/lib/email";
import { getDateUnavailableMessage } from "@/lib/booking-availability";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}

export async function createBooking(data: BookingFormData): Promise<{ success: true; bookingId: string }> {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const d = parsed.data;
  const unavailableDateMessage = getDateUnavailableMessage(d.charterStartDate);
  if (unavailableDateMessage) {
    throw new Error(unavailableDateMessage);
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
    } else {
      console.error("Failed to create booking:", error);
      throw new Error("We could not submit your booking right now. Please try again.");
    }
  }

  if (!result?.[0]) throw new Error("Failed to create booking");

  await sendBookingEmails(d, result[0].id).catch((err) => {
    console.error("Failed to send booking emails:", err);
  });

  return { success: true, bookingId: result[0].id };
}
