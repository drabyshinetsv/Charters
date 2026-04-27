"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, CheckCircle2, Phone, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createBooking } from "@/lib/actions/booking";
import { bookingSchema, type BookingFormData } from "@/lib/schemas/booking";
import { isDateUnavailable } from "@/lib/booking-availability";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function toIsoLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export default function BookingPage() {
  const [submitted, setSubmitted] = useState<{ bookingId: string } | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      contactMethodEmail: false,
      contactMethodPhone: false,
      numberOfGuests: 1,
      charterStartDate: "",
      flexibleDates: false,
      charterType: undefined,
      departureLocation: undefined,
      purposeCelebration: false,
      purposeCorporate: false,
      purposeWedding: false,
      purposeOther: false,
      purposeOtherDesc: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      setSubmitted({ bookingId: data.bookingId });
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong"),
  });

  const onSubmit = (data: BookingFormData) => mutate(data);

  const flexibleDates = watch("flexibleDates");
  const purposeOther = watch("purposeOther");
  const selectedDate = watch("charterStartDate");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = toIsoLocalDate(today);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstDayWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ iso: string; dayNumber: number; hidden: boolean }> = [];
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push({ iso: "", dayNumber: 0, hidden: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      cells.push({ iso: toIsoLocalDate(date), dayNumber: day, hidden: false });
    }

    return cells;
  }, [visibleMonth]);

  const handleDateSelect = (isoDate: string) => {
    if (isoDate < todayIso) return;

    if (isDateUnavailable(isoDate)) {
      setError("charterStartDate", {
        type: "validate",
        message: "Please choose Monday, Wednesday, or Thursday.",
      });
      toast.error("Only Monday, Wednesday, and Thursday can be selected.");
      return;
    }

    setValue("charterStartDate", isoDate, { shouldValidate: true, shouldDirty: true });
    clearErrors("charterStartDate");
    setIsCalendarOpen(false);
  };

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!calendarContainerRef.current) return;
      const targetNode = event.target as Node;
      if (!calendarContainerRef.current.contains(targetNode)) {
        setIsCalendarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCalendarOpen]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Received!</h1>
          <p className="text-gray-600 mb-4">
            We&apos;ll be in touch soon to confirm your charter.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Reference ID:{" "}
            <span className="font-mono font-semibold text-gray-700">
              {submitted.bookingId.slice(0, 8).toUpperCase()}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <a href="tel:8438600363">
                <Phone className="w-4 h-4 mr-2" />
                Call (843) 860-0363
              </a>
            </Button>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Charter</h1>
        <p className="text-gray-600 mb-8">Fill out the form and we&apos;ll get back to you to confirm your booking.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 space-y-10">

            {/* Section 1: Contact Information */}
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>

              <div>
                <Label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="John Smith"
                  aria-invalid={!!errors.fullName}
                  className={cn(inputClass, errors.fullName && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  aria-invalid={!!errors.email}
                  className={cn(inputClass, errors.email && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="(843) 555-0000"
                  aria-invalid={!!errors.phone}
                  className={cn(inputClass, errors.phone && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Preferred Contact Method</p>
                <div className="flex flex-col gap-3">
                  {[
                    { field: "contactMethodEmail" as const, label: "Email" },
                    { field: "contactMethodPhone" as const, label: "Phone" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-center gap-2">
                      <Checkbox
                        id={field}
                        checked={watch(field)}
                        onCheckedChange={(checked) => setValue(field, !!checked)}
                      />
                      <Label htmlFor={field} className="text-sm text-gray-700 cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>
                {errors.contactMethodEmail && (
                  <p className="text-sm text-red-500 mt-2">{errors.contactMethodEmail.message}</p>
                )}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: Charter Details */}
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Charter Details</h2>

              <div>
                <Label htmlFor="charterType" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Type of Charter
                </Label>
                <select
                  id="charterType"
                  {...register("charterType")}
                  aria-invalid={!!errors.charterType}
                  className={cn(inputClass, errors.charterType && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                >
                  <option value="">Select a charter type</option>
                  <option value="Daytime Charter">Daytime Charter</option>
                  <option value="Sunset Cruise">Sunset Cruise</option>
                </select>
                {errors.charterType && <p className="text-sm text-red-500 mt-1">{errors.charterType.message}</p>}
              </div>

              <div>
                <Label htmlFor="numberOfGuests" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Number of Guests
                </Label>
                <input
                  id="numberOfGuests"
                  type="number"
                  min={1}
                  max={6}
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  aria-invalid={!!errors.numberOfGuests}
                  className={cn(inputClass, errors.numberOfGuests && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                />
                <p className="text-xs text-gray-500 mt-1">You can book up to 6 people.</p>
                {errors.numberOfGuests && <p className="text-sm text-red-500 mt-1">{errors.numberOfGuests.message}</p>}
              </div>

              <div>
                <Label htmlFor="charterStartDate" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Preferred Dates
                </Label>
                <div ref={calendarContainerRef}>
                  <input type="hidden" {...register("charterStartDate")} />
                  <button
                    id="charterStartDate"
                    type="button"
                    onClick={() => setIsCalendarOpen((open) => !open)}
                    aria-invalid={!!errors.charterStartDate}
                    className={cn(
                      inputClass,
                      "flex items-center justify-between text-left",
                      !selectedDate && "text-gray-400",
                      errors.charterStartDate && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                    )}
                  >
                    <span>{selectedDate ? formatDisplayDate(selectedDate) : "mm/dd/yyyy"}</span>
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  {isCalendarOpen && (
                    <div className="mt-3 rounded-lg border border-gray-200 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleMonth(
                            (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1)
                          )
                        }
                        className="rounded-md border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <p className="text-sm font-medium text-gray-800">
                        {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleMonth(
                            (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1)
                          )
                        }
                        className="rounded-md border border-gray-200 p-1.5 text-gray-700 hover:bg-gray-50"
                        aria-label="Next month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
                      {WEEKDAY_LABELS.map((weekday) => (
                        <div key={weekday} className="py-1">
                          {weekday}
                        </div>
                      ))}
                    </div>

                      <div className="mt-1 grid grid-cols-7 gap-1">
                        {calendarDays.map((cell, idx) => {
                          if (cell.hidden) return <div key={`empty-${idx}`} className="h-9" />;

                          const isBlocked = isDateUnavailable(cell.iso);
                          const isPast = cell.iso < todayIso;
                          const isDisabled = isBlocked || isPast;
                          const isSelected = cell.iso === selectedDate;

                          return (
                            <button
                              key={cell.iso}
                              type="button"
                              onClick={() => handleDateSelect(cell.iso)}
                              disabled={isDisabled}
                              className={cn(
                                "h-9 rounded-md text-sm transition-colors",
                                isSelected && "bg-blue-600 text-white",
                                !isSelected && !isDisabled && "text-gray-800 hover:bg-blue-50",
                                isDisabled && "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                              )}
                              aria-label={`Select ${cell.iso}`}
                            >
                              {cell.dayNumber}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                          <span>Available (Mon, Wed, Thu)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
                          <span>Blocked</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Available days: Monday, Wednesday, Thursday</p>
                {errors.charterStartDate && <p className="text-sm text-red-500 mt-1">{errors.charterStartDate.message}</p>}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Flexible Dates?</p>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
                  <button
                    type="button"
                    onClick={() => setValue("flexibleDates", true)}
                    className={cn(
                      "px-5 py-2 text-sm font-medium transition-colors",
                      flexibleDates
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("flexibleDates", false)}
                    className={cn(
                      "px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300",
                      !flexibleDates
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="departureLocation" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Departure Location
                </Label>
                <select
                  id="departureLocation"
                  {...register("departureLocation")}
                  aria-invalid={!!errors.departureLocation}
                  className={cn(inputClass, errors.departureLocation && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                >
                  <option value="">Select a departure location</option>
                  <option value="Remley's Point">Remley&apos;s Point</option>
                  <option value="Wappoo Cut Boat Landing">Wappoo Cut Boat Landing</option>
                  <option value="Folly River Boat Ramp">Folly River Boat Ramp</option>
                </select>
                {errors.departureLocation && <p className="text-sm text-red-500 mt-1">{errors.departureLocation.message}</p>}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 3: Trip Preferences */}
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Trip Preferences</h2>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Purpose of Trip</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { field: "purposeCelebration" as const, label: "Celebration" },
                    { field: "purposeCorporate" as const, label: "Corporate Event" },
                    { field: "purposeWedding" as const, label: "Wedding" },
                    { field: "purposeOther" as const, label: "Other" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-center gap-2">
                      <Checkbox
                        id={field}
                        checked={watch(field)}
                        onCheckedChange={(checked) => setValue(field, !!checked)}
                      />
                      <Label htmlFor={field} className="text-sm text-gray-700 cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {purposeOther && (
                <div>
                  <Label htmlFor="purposeOtherDesc" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Please describe
                  </Label>
                  <input
                    id="purposeOtherDesc"
                    {...register("purposeOtherDesc")}
                    placeholder="Describe the purpose of your trip"
                    aria-invalid={!!errors.purposeOtherDesc}
                    className={cn(inputClass, errors.purposeOtherDesc && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
                  />
                  {errors.purposeOtherDesc && <p className="text-sm text-red-500 mt-1">{errors.purposeOtherDesc.message}</p>}
                </div>
              )}
            </section>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
