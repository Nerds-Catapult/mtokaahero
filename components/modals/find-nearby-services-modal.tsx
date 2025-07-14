"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Star } from "lucide-react"
import { toast } from 'sonner';

const findServicesSchema = z.object({
  location: z.string().min(3, "Please enter a location"),
  serviceType: z.string().min(1, "Please select a service type"),
  distance: z.string().min(1, "Please select a distance"),
})

type FindServicesFormValues = z.infer<typeof findServicesSchema>

// Mock service providers for demonstration
const mockServiceProviders = [
  {
    id: "1",
    name: "Quick Auto Care",
    rating: 4.8,
    distance: "1.2 miles",
    address: "123 Main St, Anytown",
    openUntil: "7:00 PM",
  },
  {
    id: "2",
    name: "Pro Mechanics",
    rating: 4.5,
    distance: "2.3 miles",
    address: "456 Oak Ave, Anytown",
    openUntil: "8:00 PM",
  },
  {
    id: "3",
    name: "City Garage",
    rating: 4.2,
    distance: "3.5 miles",
    address: "789 Elm Blvd, Anytown", 
    openUntil: "6:00 PM",
  },
]

interface FindNearbyServicesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FindNearbyServicesModal({ open, onOpenChange }: FindNearbyServicesModalProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof mockServiceProviders | null>(null)

  const form = useForm<FindServicesFormValues>({
    resolver: zodResolver(findServicesSchema),
    defaultValues: {
      location: "",
      serviceType: "",
      distance: "10",
    },
  })

  const onSubmit = async (data: FindServicesFormValues) => {
    setIsSearching(true)
    
    try {
      // In a real implementation, this would call a service to find nearby providers
      // For now, we'll simulate a search with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setSearchResults(mockServiceProviders)
      toast.success(`Found ${mockServiceProviders.length} service providers near ${data.location}`)
    } catch (error) {
      toast.error("An error occurred while searching. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewDetails = (serviceProviderId: string) => {
    // In a real app, this would navigate to the service provider's details page
    toast.success(`Viewing details for service provider ${serviceProviderId}`)
    onOpenChange(false)
  }

  const handleBookService = (serviceProviderId: string) => {
    // In a real app, this would open the booking form pre-filled with this service provider
    toast.success(`Opening booking form for service provider ${serviceProviderId}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Nearby Services</DialogTitle>
          <DialogDescription>
            Search for automotive service providers near your location.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter address, city, or postal code" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mechanic">Mechanic</SelectItem>
                        <SelectItem value="body-shop">Body Shop</SelectItem>
                        <SelectItem value="oil-change">Oil Change</SelectItem>
                        <SelectItem value="tire-shop">Tire Shop</SelectItem>
                        <SelectItem value="auto-parts">Auto Parts</SelectItem>
                        <SelectItem value="car-wash">Car Wash</SelectItem>
                        <SelectItem value="all">All Services</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (miles)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select distance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">Within 5 miles</SelectItem>
                        <SelectItem value="10">Within 10 miles</SelectItem>
                        <SelectItem value="15">Within 15 miles</SelectItem>
                        <SelectItem value="25">Within 25 miles</SelectItem>
                        <SelectItem value="50">Within 50 miles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </Form>
        
        {searchResults && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Search Results</h3>
            
            {searchResults.map((provider) => (
              <Card key={provider.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{provider.name}</h4>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" />
                        <span>{provider.rating} • </span>
                        <span className="ml-1">{provider.distance}</span>
                      </div>
                      <div className="flex items-center mt-2 text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{provider.address}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Open until {provider.openUntil}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(provider.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBookService(provider.id)}
                      >
                        Book Service
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
