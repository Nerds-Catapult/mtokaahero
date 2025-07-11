"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const emergencyServiceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  location: z.string().min(5, "Current location is required"),
  vehicleDetails: z.string().min(2, "Vehicle details are required"),
  description: z.string().min(10, "Please describe your emergency"),
  consent: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms",
  }),
})

type EmergencyServiceFormValues = z.infer<typeof emergencyServiceSchema>

interface EmergencyServiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessId?: string
}

export function EmergencyServiceModal({ open, onOpenChange, businessId }: EmergencyServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EmergencyServiceFormValues>({
    resolver: zodResolver(emergencyServiceSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      vehicleDetails: "",
      description: "",
      consent: false,
    },
  })

  const onSubmit = async (data: EmergencyServiceFormValues) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "Service provider information is missing. Cannot request emergency service.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real implementation, this would call a server action to save and immediately notify
      // For now, we'll simulate success after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast({
        title: "Emergency Request Received",
        description: "Your emergency service request has been received. A service provider will contact you very shortly.",
        variant: "default",
        duration: 6000,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try calling directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Emergency Roadside Assistance</DialogTitle>
          <DialogDescription className="text-red-500 font-semibold">
            For life-threatening emergencies, please call emergency services (911) directly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone where we can reach you" {...field} />
                  </FormControl>
                  <FormDescription>
                    Make sure this is a number where we can reach you immediately
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address or landmark" {...field} />
                  </FormControl>
                  <FormDescription>
                    Be as specific as possible about your location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Year, Make, Model, Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your situation (flat tire, engine won't start, etc.)"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I understand this service may incur additional charges and consent to being contacted immediately.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="destructive">
                {isSubmitting ? "Sending..." : "Request Emergency Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
