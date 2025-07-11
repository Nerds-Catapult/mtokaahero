"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const businessInfoSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Valid address is required"),
  website: z.string().url("Valid URL is required").or(z.string().length(0)),
  operatingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
    friday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      open: z.string(),
      close: z.string(),
    }),
  }),
})

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>

const defaultHours = {
  isOpen: true,
  open: "09:00",
  close: "17:00"
}

const weekendHours = {
  isOpen: false,
  open: "09:00",
  close: "17:00"
}

interface UpdateBusinessInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessId?: string
  initialData?: Partial<BusinessInfoFormValues>
}

export function UpdateBusinessInfoModal({ 
  open, 
  onOpenChange, 
  businessId,
  initialData 
}: UpdateBusinessInfoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      operatingHours: {
        monday: defaultHours,
        tuesday: defaultHours,
        wednesday: defaultHours,
        thursday: defaultHours,
        friday: defaultHours,
        saturday: weekendHours,
        sunday: weekendHours,
      },
    },
  })

  const onSubmit = async (data: BusinessInfoFormValues) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "Business ID is missing. Cannot update information.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real implementation, this would call a server action to update the business
      // For now, we'll simulate success after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast({
        title: "Business Updated",
        description: "Your business information has been updated successfully.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Business Information</DialogTitle>
          <DialogDescription>
            Update your business details to keep your profile accurate and help customers find you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
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
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business, services, specialties, etc."
                      className="resize-none"
                      rows={3}
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Business phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Business email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full business address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourbusiness.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Operating Hours</h3>
              
              {days.map((day, index) => (
                <div key={day} className="flex items-start space-x-4 bg-muted/50 p-2 rounded">
                  <div className="w-24 pt-2">
                    <FormField
                      control={form.control}
                      name={`operatingHours.${day}.isOpen` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium">
                            {dayLabels[index]}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <FormField
                      control={form.control}
                      name={`operatingHours.${day}.open` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Open</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field}
                              disabled={!form.watch(`operatingHours.${day}.isOpen` as any)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`operatingHours.${day}.close` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Close</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field}
                              disabled={!form.watch(`operatingHours.${day}.isOpen` as any)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
