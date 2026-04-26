import { z } from "zod";

const DEPARTURE_LOCATIONS = ["Remley's Point", "Wappoo Cut Boat Landing", "Folly River Boat Ramp"] as const;
const CHARTER_TYPES = ["Daytime Charter", "Sunset Cruise"] as const;

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  contactMethodEmail: z.boolean(),
  contactMethodPhone: z.boolean(),
  numberOfGuests: z
    .number({ invalid_type_error: "Enter a number" })
    .int()
    .min(1, "At least 1 guest")
    .max(6, "Maximum 6 guests"),
  charterStartDate: z.string().min(1, "Start date is required"),
  flexibleDates: z.boolean(),
  charterType: z.enum(CHARTER_TYPES, { errorMap: () => ({ message: "Select a charter type" }) }),
  departureLocation: z.enum(DEPARTURE_LOCATIONS, { errorMap: () => ({ message: "Select a location" }) }),
  purposeCelebration: z.boolean(),
  purposeCorporate: z.boolean(),
  purposeWedding: z.boolean(),
  purposeOther: z.boolean(),
  purposeOtherDesc: z.string().optional(),
}).superRefine((d, ctx) => {
  if (!d.contactMethodEmail && !d.contactMethodPhone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select at least one contact method", path: ["contactMethodEmail"] });
  }
  if (d.purposeOther && !d.purposeOtherDesc?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please describe the purpose", path: ["purposeOtherDesc"] });
  }
});

export type BookingFormData = z.infer<typeof bookingSchema>;
