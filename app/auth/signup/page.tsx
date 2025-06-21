"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Car, Wrench, Package } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [userType, setUserType] = useState("")
  const [step, setStep] = useState(1)

  const userTypes = [
    {
      id: "garage",
      title: "Garage Owner",
      description: "Run a professional automotive repair shop",
      icon: Car,
      color: "text-blue-600",
    },
    {
      id: "mechanic",
      title: "Freelance Mechanic",
      description: "Offer independent automotive services",
      icon: Wrench,
      color: "text-green-600",
    },
    {
      id: "parts",
      title: "Spare Parts Shop",
      description: "Sell automotive parts and accessories",
      icon: Package,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MtokaaHero</h1>
          <p className="text-gray-600">Start growing your automotive business today</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Business Type</CardTitle>
              <CardDescription>Select the option that best describes your business</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={userType} onValueChange={setUserType} className="space-y-4">
                {userTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value={type.id} id={type.id} />
                    <div className="flex items-center space-x-3 flex-1">
                      <type.icon className={`h-8 w-8 ${type.color}`} />
                      <div>
                        <Label htmlFor={type.id} className="text-base font-medium cursor-pointer">
                          {type.title}
                        </Label>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8">
                <Link href="/auth/signin">
                  <Button variant="ghost">Already have an account?</Button>
                </Link>
                <Button onClick={() => setStep(2)} disabled={!userType}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>Tell us about yourself and your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Your business name" />
              </div>

              <div>
                <Label htmlFor="location">Business Location</Label>
                <Input id="location" placeholder="City, State" />
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea id="description" placeholder="Tell customers about your services..." rows={3} />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Link href="/dashboard">
                  <Button>Create Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
