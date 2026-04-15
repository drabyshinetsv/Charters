import Link from "next/link";
import { Anchor, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Anchor className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          This page seems to have drifted away.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Home
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Book a Charter
          </Link>
        </div>
        <p className="mt-8 text-gray-500 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          <a href="tel:+18438600363" className="hover:text-blue-600">
            (843) 860-0363
          </a>
        </p>
      </div>
    </div>
  );
}
