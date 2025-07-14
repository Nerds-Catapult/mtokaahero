"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "Configuration":
        return {
          title: "Server Configuration Error",
          description: "There's a configuration issue with the authentication system. Please contact support.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
        };
      case "Verification":
        return {
          title: "Email Verification Required",
          description: "Please check your email and click the verification link before signing in.",
        };
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect. Please try again.",
        };
      case "EmailNotVerified":
        return {
          title: "Email Not Verified",
          description: "Please verify your email address before signing in. Check your inbox for a verification link.",
        };
      case "AccountDeactivated":
        return {
          title: "Account Deactivated",
          description: "Your account has been deactivated. Please contact support for assistance.",
        };
      case "TooManyAttempts":
        return {
          title: "Too Many Attempts",
          description: "Too many failed sign-in attempts. Please wait a moment before trying again.",
        };
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication. Please try again.",
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Image
              src="/logo.png"
              alt="MtokaaHero Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-logo.png";
              }}
            />
            <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Error Code: {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Signing In Again
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
            </div>

            {(error === "EmailNotVerified" || error === "Verification") && (
              <div className="text-center text-sm text-gray-600">
                <p>Didn't receive the verification email?</p>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  Resend verification email
                </Button>
              </div>
            )}

            {error === "AccountDeactivated" && (
              <div className="text-center text-sm text-gray-600">
                <p>Need help with your account?</p>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  Contact Support
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
