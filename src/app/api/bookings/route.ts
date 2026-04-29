import { NextResponse } from "next/server";
import { createBooking } from "@/lib/create-booking";
import type { BookingFormData } from "@/lib/schemas/booking";

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await createBooking(body as BookingFormData);

    if (result.success) {
      return NextResponse.json({ success: true, bookingId: result.bookingId });
    }

    return NextResponse.json({ success: false, message: result.message }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/bookings:", error);
    return NextResponse.json(
      { success: false, message: "We could not submit your booking right now. Please try again." },
      { status: 500 },
    );
  }
}
