import nodemailer from "nodemailer";
import type { BookingFormData } from "@/lib/schemas/booking";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FALLBACK_OWNER_EMAIL = "lccoastalcharters@gmail.com";

export async function sendBookingEmails(data: BookingFormData, bookingId: string) {
  if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Email is not configured: missing GMAIL_USERNAME or GMAIL_APP_PASSWORD");
  }

  const refId = bookingId.slice(0, 8).toUpperCase();

  const purposes = [
    data.purposeCelebration && "Celebration",
    data.purposeCorporate && "Corporate Event",
    data.purposeWedding && "Wedding",
    data.purposeOther && `Other: ${data.purposeOtherDesc}`,
  ]
    .filter(Boolean)
    .join(", ") || "Not specified";

  const contactMethods = [
    data.contactMethodEmail && "Email",
    data.contactMethodPhone && "Phone",
  ]
    .filter(Boolean)
    .join(", ");

  const detailsHtml = `
    <table cellpadding="6" style="border-collapse:collapse;">
      <tr><td><strong>Reference ID</strong></td><td>${refId}</td></tr>
      <tr><td><strong>Charter Type</strong></td><td>${data.charterType}</td></tr>
      <tr><td><strong>Guests</strong></td><td>${data.numberOfGuests}</td></tr>
      <tr><td><strong>Preferred Date</strong></td><td>${data.charterStartDate}${data.flexibleDates ? " (flexible)" : ""}</td></tr>
      <tr><td><strong>Departure</strong></td><td>${data.departureLocation}</td></tr>
      <tr><td><strong>Purpose</strong></td><td>${purposes}</td></tr>
      <tr><td><strong>Preferred Contact</strong></td><td>${contactMethods}</td></tr>
    </table>
  `;

  await Promise.all([
    // Confirmation to customer
    transporter.sendMail({
      from: `"Charleston Charters" <${process.env.GMAIL_USERNAME}>`,
      to: data.email,
      subject: `Booking Request Received – ${data.charterType}`,
      html: `
        <h2>Thanks, ${data.fullName}!</h2>
        <p>We've received your booking request and will be in touch soon to confirm your charter.</p>
        <h3>Your Booking Details</h3>
        ${detailsHtml}
        <br/>
        <p>Questions? Call us at <a href="tel:8438600363">(843) 860-0363</a>.</p>
      `,
    }),

    // Notification to owner
    transporter.sendMail({
      from: `"Booking System" <${process.env.GMAIL_USERNAME}>`,
      to: process.env.OWNER_EMAIL ?? FALLBACK_OWNER_EMAIL,
      subject: `New Booking Request – ${data.fullName}`,
      html: `
        <h2>New Booking Request</h2>
        <table cellpadding="6" style="border-collapse:collapse;">
          <tr><td><strong>Reference ID</strong></td><td>${refId}</td></tr>
          <tr><td><strong>Name</strong></td><td>${data.fullName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
          <tr><td><strong>Preferred Contact</strong></td><td>${contactMethods}</td></tr>
          <tr><td><strong>Charter Type</strong></td><td>${data.charterType}</td></tr>
          <tr><td><strong>Guests</strong></td><td>${data.numberOfGuests}</td></tr>
          <tr><td><strong>Preferred Date</strong></td><td>${data.charterStartDate}${data.flexibleDates ? " (flexible)" : ""}</td></tr>
          <tr><td><strong>Departure</strong></td><td>${data.departureLocation}</td></tr>
          <tr><td><strong>Purpose</strong></td><td>${purposes}</td></tr>
        </table>
      `,
    }),
  ]);
}
