import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Charter",
  description:
    "Request a private boat charter in Charleston, SC. Daytime charters, sunset cruises, and special trips for up to 6 guests. We confirm by email or phone.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
