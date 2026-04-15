import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/query";
import { ThemeProvider } from "@/lib/providers/theme";
import AuthProvider from "@/lib/providers/auth";
import { Toaster } from "sonner";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const siteName = "Low Country Coastal Charters";
const defaultTitle = `${siteName} | Private Boat Charters Charleston SC`;
const defaultDescription =
  "Book a private charter in Charleston, SC with Captain Bobby Baker. Harbor tours, sunset cruises, dolphin trips, and daytime charters for up to 6 guests. Departures from Remley's Point, Wappoo Cut, and Folly River.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "Charleston boat charter",
    "private charter Charleston SC",
    "sunset cruise Charleston",
    "harbor tour Charleston",
    "dolphin tour Charleston",
    "Lowcountry boat charter",
    "Folly River boat ramp charter",
    "Wappoo Cut boat landing",
    "Remley's Point charter",
    "Captain Bobby Baker",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="min-h-[100%] flex flex-col"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grow-1 flex flex-col bg-neutral-50`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              {children}
              <Toaster />
            </ReactQueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
