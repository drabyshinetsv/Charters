"use server";

import { createBooking as createBookingCore } from "@/lib/create-booking";
import type { BookingFormData } from "@/lib/schemas/booking";

export async function createBooking(data: BookingFormData) {
  return createBookingCore(data);
}
