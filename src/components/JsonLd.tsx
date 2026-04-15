import { getSiteUrl } from "@/lib/site-url";

export default function JsonLd() {
  const siteUrl = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: "Low Country Coastal Charters",
        description:
          "Private boat charters in Charleston, SC with Captain Bobby Baker. Harbor tours, sunset cruises, dolphin trips, and daytime charters for up to 6 guests.",
        url: siteUrl,
        telephone: "+1-843-860-0363",
        email: "lccoastalcharters@gmail.com",
        image: `${siteUrl}/hero.webp`,
        priceRange: "$$",
        currenciesAccepted: "USD",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Charleston",
          addressRegion: "SC",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 32.7765,
          longitude: -79.9311,
        },
        areaServed: {
          "@type": "City",
          name: "Charleston",
          addressRegion: "SC",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
          reviewCount: "4",
        },
        review: [
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Sarah Johnson" },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody:
              "Amazing experience! Captain Robert was knowledgeable and friendly. The sunset cruise was absolutely magical.",
            datePublished: "2025-03-01",
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Mike Davis" },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody:
              "Best charter service in the area! Great value for money and Robert really knows these waters well.",
            datePublished: "2025-02-15",
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Emily Chen" },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody:
              "Perfect for our family vacation. The kids loved it and we saw dolphins! Highly recommend.",
            datePublished: "2025-02-22",
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "James Wilson" },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody:
              "Professional service, clean boat, and great communication. Will definitely book again!",
            datePublished: "2025-01-15",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Charter Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Harbor Tours",
                description:
                  "Explore the beautiful coastline and discover hidden gems along our scenic waterways.",
              },
              price: "100",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "100",
                priceCurrency: "USD",
                unitText: "hour",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Sunset Cruises",
                description:
                  "Experience breathtaking sunsets from the water with your loved ones.",
              },
              price: "100",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "100",
                priceCurrency: "USD",
                unitText: "hour",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Private Charters",
                description:
                  "Customize your perfect day on the water with our private charter service.",
              },
              price: "300",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "300",
                priceCurrency: "USD",
                unitText: "3 hour minimum",
              },
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How many guests can the charter accommodate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our private charters accommodate up to 6 guests.",
            },
          },
          {
            "@type": "Question",
            name: "What is the minimum charter time?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The minimum charter is 3 hours at $300. Additional time is available at $125 per hour.",
            },
          },
          {
            "@type": "Question",
            name: "Where do charters depart from?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We depart from three locations: Remley's Point in Mt Pleasant, Wappoo Cut Boat Landing in Charleston, and Folly River Boat Ramp in Charleston, SC.",
            },
          },
          {
            "@type": "Question",
            name: "What types of charters are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer harbor tours, sunset cruises, private charters, and dolphin watching trips in the Charleston, SC area.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
