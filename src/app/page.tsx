"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Phone, MapPin, Star, Sunset, Users, Anchor, Fish } from "lucide-react";
import Image from "next/image";
import LocationSection from "@/components/LocationSection";

export default function Page() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const services = [
    {
      title: "Harbor Tours",
      description:
        "Explore the beautiful coastline and discover hidden gems along our scenic waterways.",
      icon: <Anchor className="w-8 h-8" />,
    },
    {
      title: "Sunset Cruises",
      description:
        "Experience breathtaking sunsets from the water with your loved ones.",
      icon: <Sunset className="w-8 h-8" />,
    },
    {
      title: "Private Charters",
      description:
        "Customize your perfect day on the water with our private charter service.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Fishing Expeditions",
      description:
        "Try your luck at catching the big one with our experienced fishing guides.",
      icon: <Fish className="w-8 h-8" />,
    },
  ];

  const galleryImages = ["/1.webp", "/2.webp", "/3.webp", "/4.webp", "/5.webp"];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing experience! Captain Robert was knowledgeable and friendly. The sunset cruise was absolutely magical.",
      date: "2 weeks ago",
    },
    {
      name: "Mike Davis",
      rating: 5,
      text: "Best charter service in the area! Great value for money and Robert really knows these waters well.",
      date: "1 month ago",
    },
    {
      name: "Emily Chen",
      rating: 5,
      text: "Perfect for our family vacation. The kids loved it and we saw dolphins! Highly recommend.",
      date: "3 weeks ago",
    },
    {
      name: "James Wilson",
      rating: 5,
      text: "Professional service, clean boat, and great communication. Will definitely book again!",
      date: "2 months ago",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-22 h-12  flex items-center justify-center">
                <Image src="/logo.webp" alt="logo" width={200} height={200} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Captain Robert
                </h1>
                <p className="text-sm text-gray-600">Charter Services</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection("location")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Location
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  Robert Baker
                </p>
                <p className="text-sm text-gray-600">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Charleston, SC
                </p>
              </div>
              <Button
                onClick={() => window.open("tel:843-860-0363")}
                variant="ghost"
              >
                <Phone className="w-4 h-4 mr-2" />
                (843) 860-0363
              </Button>
              <Button>Book Now</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('hero.webp')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Premium Charter
            <span className="block text-blue-400">Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover the beauty of Charleston waters with Captain Robert Baker
          </p>
          <div>
            <Button
              size="lg"
              onClick={() => window.open("tel:843-860-0363")}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 mr-4"
            >
              Book Now - (843) 860-0363
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("services")}
              className="border-white text-black hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Charter Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the waters like never before with our premium charter
              services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Charter Pricing
              </h3>
              <p className="text-gray-600">
                Transparent pricing for your perfect day on the water
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Base Rate */}
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Anchor className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Standard Rate
                </h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  $100
                </div>
                <div className="text-gray-600 mb-4">per hour</div>
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  Perfect for harbor tours, sightseeing, and sunset cruises
                </div>
              </div>

              {/* Minimum Charter */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-xl shadow-lg text-white text-center transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  Most Popular
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Minimum Charter</h4>
                <div className="text-3xl font-bold mb-2">3 Hours</div>
                <div className="text-blue-100 mb-4">$300 total</div>
                <div className="text-sm text-blue-100 bg-white/10 rounded-lg p-3">
                  Minimum booking requirement for all charter experiences
                </div>
              </div>

              {/* Extended Time */}
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Sunset className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Extended Time
                </h4>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  $125
                </div>
                <div className="text-gray-600 mb-4">per hour</div>
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  Additional hours beyond the 3-hour minimum charter
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Ready to book your charter experience?
              </p>
              <Button
                size="lg"
                onClick={() => window.open("tel:843-860-0363")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              >
                Call Now: (843) 860-0363
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h2>
          </div>

          <div>
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Charter experience ${index + 1}`}
                          className="object-cover hover:scale-105 transition-transform duration-300 w-full h-full"
                          width={800}
                          height={800}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <LocationSection />

      {/* Reviews Section */}
      <section id="reviews" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Reviews</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                About Captain Robert
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Experience the Lowcountry with Captain Bobby Baker
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Set sail with Low Country Coastal Charters, where every trip
                    is more than a boat ride — it's an unforgettable adventure
                    along the scenic waterways of the South Carolina coast.
                    Whether you're seeking dolphin sightings, sunset serenity,
                    romantic escapes, or a journey through the rich history of
                    the Lowcountry, Captain Bobby Baker is your trusted guide to
                    the region’s most captivating sights and stories.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Climb aboard our comfortable, well-equipped vessel and
                    discover:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mb-6">
                    <li>Playful dolphins in their natural habitat</li>
                    <li>Stunning sunset views that paint the sky</li>
                    <li>Intimate cruises perfect for couples</li>
                    <li>Relaxing sightseeing tours of the coast</li>
                    <li>Fascinating tales from centuries of coastal history</li>
                  </ul>
                  <p className="text-gray-600 mb-6">
                    Let the rhythm of the tides and the warm southern breeze
                    carry you away. With a lifetime on these waters, Captain
                    Bobby brings deep knowledge, hospitality, and a personal
                    touch to every charter.
                  </p>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-blue-600" />
                      (843) 860-0363
                    </p>
                    <p className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      Charleston, South Carolina
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/person.webp"
                    alt="Captain Robert"
                    className="rounded-lg shadow-lg w-full"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Anchor className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">
                  Captain Robert Charter Services
                </h3>
              </div>
              <p className="text-gray-400">
                Experience the beauty of Charleston waters with premium charter
                services.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <p className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3" />
                  (843) 860-0363
                </p>
                <p className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-3" />
                  Charleston, SC
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Charter Rates</h4>
              <div className="space-y-2 text-gray-300">
                <p>$100 per hour</p>
                <p>3 hour minimum</p>
                <p>Additional time: $125/hour</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Captain Robert Charter Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
