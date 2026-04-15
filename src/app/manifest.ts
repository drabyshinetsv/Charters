import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Low Country Coastal Charters",
    short_name: "LC Charters",
    description:
      "Private boat charters in Charleston, SC with Captain Bobby Baker",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      { src: "/logo.webp", sizes: "any", type: "image/webp" },
    ],
  };
}
