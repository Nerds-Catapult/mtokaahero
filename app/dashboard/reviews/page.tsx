"use client"

import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { allReviews } from '@/lib/constants';
import { Filter, Flag, MessageSquare, Reply, Search, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [showReplyDialog, setShowReplyDialog] = useState<any>(null)

  const filteredReviews = allReviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const reviewStats = {
    total: allReviews.length,
    avgRating: (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1),
    fiveStars: allReviews.filter((r) => r.rating === 5).length,
    needsResponse: allReviews.filter((r) => !r.response).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reviews Management</h1>
            <p className="text-muted-foreground">Manage customer feedback and maintain your reputation</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{reviewStats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold flex items-center">
                    {reviewStats.avgRating}
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-green-600">{reviewStats.fiveStars}</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Response</p>
                  <p className="text-2xl font-bold text-orange-600">{reviewStats.needsResponse}</p>
                </div>
                <Reply className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews ({filteredReviews.length})</CardTitle>
            <CardDescription>Manage and respond to customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{review.customerName}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="outline">{review.service}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!review.response && <Badge variant="secondary">Needs Response</Badge>}
                      <Button size="sm" variant="outline">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {review.response && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">Your Response</Badge>
                        <span className="text-xs text-muted-foreground">{review.responseDate}</span>
                      </div>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => setShowReplyDialog(review)}>
                      <Reply className="h-4 w-4 mr-1" />
                      {review.response ? "Edit Response" : "Reply"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Thank Customer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reply Dialog */}
        <Dialog open={!!showReplyDialog} onOpenChange={() => setShowReplyDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{showReplyDialog?.response ? "Edit Response" : "Reply to Review"}</DialogTitle>
              <DialogDescription>Respond professionally to {showReplyDialog?.customerName}'s review</DialogDescription>
            </DialogHeader>
            {showReplyDialog && (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{showReplyDialog.customerName}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < showReplyDialog.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{showReplyDialog.comment}</p>
                </div>
                <div>
                  <Textarea
                    placeholder="Write your professional response..."
                    defaultValue={showReplyDialog.response || ""}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowReplyDialog(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowReplyDialog(null)} className="flex-1">
                    {showReplyDialog.response ? "Update Response" : "Send Response"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
