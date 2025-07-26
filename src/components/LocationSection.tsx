"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
}

const locations: Location[] = [
  {
    id: "charleston",
    name: "Remley's Point",
    address: "Remleys Point Boat Landing, 80 5th Ave, Mt Pleasant, SC 29464",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d34193.89282750512!2d-79.92966319627406!3d32.80556346092602!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88fe7064d0508c2d%3A0x1ff07e96972ba0b4!2sRemleys%20Point%20Boat%20Landing!5e0!3m2!1sen!2sua!4v1753559819193!5m2!1sen!2sua",
  },
  {
    id: "savannah",
    name: "Wappoo Cut Boat Landing",
    address: "Tranquil Dr, Charleston, SC 29412",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d33045.21771350096!2d-79.97575959910344!3d32.76223201713316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88fe7bd7bbf6ac87%3A0xc9ef74d35c0689b2!2sWappoo%20Cut%20Boat%20Landing!5e0!3m2!1sen!2sua!4v1753560254217!5m2!1sen!2sua",
  },
  {
    id: "hiltonhead",
    name: "Folly River Boat Ramp",
    address: "97 Center St, Charleston, SC 29412",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d74655.74636612172!2d-80.00144997832561!3d32.71208264278783!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88fdd7c25c4050bd%3A0xcabf5918faa91877!2sFolly%20River%20Boat%20Ramp!5e0!3m2!1sen!2sua!4v1753560321592!5m2!1sen!2sua",
  },
];

export default function LocationSection() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    locations[0],
  );

  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us</h2>
          {/* Location Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedLocation.id === location.id
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-[2/1] bg-gray-200">
            <iframe
              key={selectedLocation.id} // Force re-render when location changes
              src={selectedLocation.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-8">
            <div className="flex items-center space-x-4 text-gray-700">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold">{selectedLocation.name}</p>
                <p>{selectedLocation.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
