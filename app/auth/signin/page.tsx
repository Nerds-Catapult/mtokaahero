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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from 'lucide-react';
import { getSession, signIn } from "next-auth/react";
import Image from 'next/image';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
      if (isAuthenticated) {
          router.push(callbackUrl);
      }

      // Check for error in URL params (from NextAuth error redirect)
      const error = searchParams.get('error');
      if (error) {
          setError(getErrorMessage(error));
      }
  }, [isAuthenticated, router, callbackUrl, searchParams]);

  const getErrorMessage = (error: string) => {
      switch (error) {
          case 'CredentialsSignin':
              return 'Invalid email or password';
          case 'EmailNotVerified':
              return 'Please verify your email address before signing in';
          case 'AccountDeactivated':
              return 'Your account has been deactivated. Please contact support';
          case 'TooManyAttempts':
              return 'Too many failed attempts. Please try again later';
          default:
              return 'An error occurred during sign in. Please try again';
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
          // Handle specific error messages from our auth provider
          setError(getErrorMessage(result.error));
      } else if (result?.ok) {
          // Get fresh session and redirect
          const session = await getSession();
          if (session) {
              router.push(callbackUrl);
              router.refresh();
          }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

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
                // Fallback to placeholder if logo doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-logo.png";
              }}
            />
            <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
              </span>
              <Link
                href="/auth/signup"
                className="text-sm text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
