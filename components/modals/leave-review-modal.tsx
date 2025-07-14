"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { Star } from "lucide-react"

const reviewFormSchema = z.object({
  businessId: z.string().min(1, "Please select a business"),
  rating: z.string().min(1, "Please select a rating"),
  comment: z.string().min(10, "Please provide more details about your experience").max(500, "Review comment must be less than 500 characters"),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

// Mock businesses for demonstration
const mockBusinesses = [
  { id: "1", name: "Quick Auto Care" },
  { id: "2", name: "Pro Mechanics" },
  { id: "3", name: "City Garage" },
]

interface LeaveReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedBusinessId?: string
  userId?: string
}

export function LeaveReviewModal({ 
  open, 
  onOpenChange, 
  preselectedBusinessId,
  userId
}: LeaveReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number>(0)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      businessId: preselectedBusinessId || "",
      rating: "",
      comment: "",
    },
  })

  const onSubmit = async (data: ReviewFormValues) => {
    if (!userId) {
      toast.error("You must be logged in to leave a review.")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real implementation, this would call a server action to save the review
      // For now, we'll simulate success after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const businessName = mockBusinesses.find(b => b.id === data.businessId)?.name || "the business"
      
      toast.success(`Thank you for reviewing ${businessName}! Your feedback helps others in the community.`)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    form.setValue("rating", rating.toString(), { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience to help others in the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="businessId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!!preselectedBusinessId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the business to review" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockBusinesses.map((business) => (
                        <SelectItem key={business.id} value={business.id}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => handleRatingClick(rating)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= selectedRating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            } cursor-pointer`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Click on a star to rate from 1 to 5
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share details of your experience with this business"
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your honest feedback helps both the business and other customers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
