'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Filter, MapPin, Star, Clock, Phone, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { marketplaceListings } from '@/lib/mock-data';
import Image from 'next/image';

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', label: 'All Services' },
        { id: 'garage', label: 'Garages' },
        { id: 'mechanic', label: 'Mechanics' },
        { id: 'parts', label: 'Spare Parts' },
    ];

    const filteredListings = marketplaceListings.filter(listing => {
        const matchesCategory = selectedCategory === 'all' || listing.type === selectedCategory;
        const matchesSearch =
            listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        {/* <Car className="h-8 w-8 text-blue-600" />
                         */}
                        <Image
                            src="/logo.png"
                            alt="MtokaaHero Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={e => {
                                // Fallback to placeholder if logo doesn't exist
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-logo.png';
                            }}
                        />
                        <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/marketplace" className="text-blue-600 font-medium">
                            Marketplace
                        </Link>
                        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                            My Bookings
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost">Sign In</Button>
                        <Button>List Your Business</Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Automotive Marketplace</h1>
                    <p className="text-gray-600">Find trusted automotive services in your area</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search services, parts, or businesses..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </Button>
                    </div>
                </div>

                {/* Results */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Listings */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">{filteredListings.length} Results Found</h2>
                            <Select defaultValue="rating">
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="distance">Nearest</SelectItem>
                                    <SelectItem value="price">Price: Low to High</SelectItem>
                                    <SelectItem value="reviews">Most Reviews</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-6">
                            {filteredListings.map(listing => (
                                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1">{listing.name}</h3>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    <span className="text-sm">{listing.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                        <span className="font-medium">{listing.rating}</span>
                                                        <span className="text-gray-500 ml-1">
                                                            ({listing.reviews} reviews)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-green-600">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        <span className="text-sm">Open Now</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    listing.type === 'garage'
                                                        ? 'default'
                                                        : listing.type === 'mechanic'
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                            >
                                                {listing.type}
                                            </Badge>
                                        </div>

                                        <p className="text-gray-600 mb-4">{listing.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {listing.services.map((service, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                Starting from{' '}
                                                <span className="font-semibold text-gray-900">
                                                    ${listing.priceRange}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Phone className="h-4 w-4 mr-1" />
                                                    Call
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    Message
                                                </Button>
                                                <Button size="sm">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    Book Now
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Services</CardTitle>
                                <CardDescription>Popular services in your area</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {['Oil Change', 'Brake Repair', 'Engine Diagnostics', 'Tire Replacement'].map(
                                        (service, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                            >
                                                <span className="text-sm">{service}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    Popular
                                                </Badge>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Quote */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Get Quick Quote</CardTitle>
                                <CardDescription>Tell us what you need</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Service Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="oil-change">Oil Change</SelectItem>
                                        <SelectItem value="brake-repair">Brake Repair</SelectItem>
                                        <SelectItem value="engine">Engine Repair</SelectItem>
                                        <SelectItem value="tires">Tire Service</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Your location" />
                                <Button className="w-full">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Get Quotes
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Emergency Services */}
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="text-red-800">Emergency Services</CardTitle>
                                <CardDescription className="text-red-600">24/7 roadside assistance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full bg-red-600 hover:bg-red-700">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Emergency
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
