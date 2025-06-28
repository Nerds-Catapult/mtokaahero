import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
  MapPin,
  Clock,
  Star,
  Search,
  Wrench,
  Settings,
  Phone,
  Shield,
  CheckCircle,
  Award,
  Zap,
  HeartHandshake,
  TrendingUp,
  MessageSquare,
  Calendar,
  DollarSign,
  Car,
} from "lucide-react"
import Link from "next/link"
import { featuredListings, stats } from "@/lib/mock-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <Car className="h-8 w-8 text-blue-600" /> */}
            <Image
              src="/logo.png"
              alt="MtokaaHero Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
              Find Services
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How it Works
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Join MtokaaHero</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Trusted
              <span className="text-blue-600 block">Automotive Network</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with verified garages, skilled mechanics, and quality spare parts shops. Get your vehicle serviced
              by trusted professionals in your area with transparent pricing and guaranteed quality.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-xl shadow-lg border border-blue-100">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    placeholder="What service do you need?"
                    className="pl-10 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    placeholder="Enter your location"
                    className="pl-10 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                Verified Professionals
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Quality Guaranteed
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                Top Rated Service
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How MtokaaHero Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting your vehicle serviced has never been easier. Follow these simple steps to connect with trusted
              professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Search & Compare</h3>
              <p className="text-gray-600">
                Search for automotive services in your area. Compare prices, ratings, and reviews from verified
                professionals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Book & Schedule</h3>
              <p className="text-gray-600">
                Book your preferred service provider instantly. Choose a convenient time slot that works for your
                schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Service & Pay</h3>
              <p className="text-gray-600">
                Receive quality service from verified professionals. Pay securely through our platform with transparent
                pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find What You Need</h2>
            <p className="text-xl text-gray-600">
              Whether you need routine maintenance or emergency repairs, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-200">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Garages & Workshops</CardTitle>
                <CardDescription className="text-gray-600">
                  Professional automotive repair and maintenance services with certified technicians and modern
                  equipment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Full-service repairs
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Modern diagnostic tools
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Certified technicians
                  </div>
                </div>
                <Link href="/marketplace?type=garage">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                    Find Garages
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-green-100 hover:border-green-200">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-900">Freelance Mechanics</CardTitle>
                <CardDescription className="text-gray-600">
                  Skilled independent mechanics for on-site repairs and mobile services at your convenience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Mobile service available
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Flexible scheduling
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Competitive pricing
                  </div>
                </div>
                <Link href="/marketplace?type=mechanic">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                    Find Mechanics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-200">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-orange-900">Spare Parts Shops</CardTitle>
                <CardDescription className="text-gray-600">
                  Quality automotive parts and accessories with expert advice and fast delivery options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    OEM & aftermarket parts
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Fast delivery
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Expert advice
                  </div>
                </div>
                <Link href="/marketplace?type=parts">
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    Find Parts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Services</h2>
              <p className="text-gray-600">Top-rated automotive professionals in your area</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                View All Services
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card
                key={listing.id}
                className="hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-blue-200"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-gray-900">{listing.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1 text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        listing.type === "garage" ? "default" : listing.type === "mechanic" ? "secondary" : "outline"
                      }
                      className={
                        listing.type === "garage"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : listing.type === "mechanic"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      }
                    >
                      {listing.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{listing.rating}</span>
                      <span className="text-gray-500 ml-1">({listing.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Open Now</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {listing.services.slice(0, 2).map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {service}
                      </Badge>
                    ))}
                    {listing.services.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        +{listing.services.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Starting from <span className="font-semibold text-gray-900">${listing.priceRange}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link href={`/marketplace/${listing.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MtokaaHero?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to connecting you with the best automotive professionals while ensuring quality and
              transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600 text-sm">
                All service providers are thoroughly vetted and verified for your safety and peace of mind.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm">
                No hidden fees or surprise charges. Get upfront pricing and detailed quotes before you commit.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600 text-sm">
                Book services in minutes with our user-friendly platform. No lengthy phone calls or waiting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600 text-sm">
                We stand behind every service with our quality guarantee and customer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of automotive professionals on MtokaaHero and connect with customers in your area. Increase
            your visibility, grow your business, and build lasting relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <TrendingUp className="h-5 w-5 mr-2" />
                List Your Business
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <MessageSquare className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/car.png"
                  alt="Car Icon"
                  width={24}
                  height={24}
                  className="h-6 w-6 text-blue-400"
                />

                <span className="text-xl font-bold">MtokaaHero</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting automotive professionals with customers across the region. Your trusted partner for all
                automotive needs.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/marketplace" className="hover:text-white transition-colors">
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" className="hover:text-white transition-colors">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Get Quotes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Emergency Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Businesses</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/signup" className="hover:text-white transition-colors">
                    List Your Business
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Business Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MtokaaHero. All rights reserved. Built with ❤️ for the automotive community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
