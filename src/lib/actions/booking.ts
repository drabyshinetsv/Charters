"use server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { bookingSchema, type BookingFormData } from "@/lib/schemas/booking";
import { sendBookingEmails } from "@/lib/email";

export async function createBooking(data: BookingFormData): Promise<{ success: true; bookingId: string }> {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const d = parsed.data;
  const result = await db.insert(bookings).values({
    ...d,
    purposeOtherDesc: d.purposeOther ? (d.purposeOtherDesc ?? null) : null,
    status: "pending",
  }).returning({ id: bookings.id });

  if (!result[0]) throw new Error("Failed to create booking");

  await sendBookingEmails(d, result[0].id).catch((err) => {
    console.error("Failed to send booking emails:", err);
  });

  return { success: true, bookingId: result[0].id };
}
