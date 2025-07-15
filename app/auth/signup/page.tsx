'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/lib/generated/prisma';
import { Car, Loader2, Package, User, Wrench } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
    const [userType, setUserType] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: UserRole.CUSTOMER as UserRole,
    });

    const [businessData, setBusinessData] = useState({
        businessName: '',
        description: '',
        licenseNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Kenya',
        },
        workingHours: {
            monday: { open: '08:00', close: '18:00', isOpen: true },
            tuesday: { open: '08:00', close: '18:00', isOpen: true },
            wednesday: { open: '08:00', close: '18:00', isOpen: true },
            thursday: { open: '08:00', close: '18:00', isOpen: true },
            friday: { open: '08:00', close: '18:00', isOpen: true },
            saturday: { open: '08:00', close: '16:00', isOpen: true },
            sunday: { open: '10:00', close: '16:00', isOpen: false },
        },
    });
    const router = useRouter();

    const userTypes = [
        {
            id: 'customer',
            title: 'Customer',
            description: 'Find automotive services and parts',
            icon: User,
            color: 'text-purple-600',
            role: UserRole.CUSTOMER,
        },
        {
            id: 'garage',
            title: 'Garage Owner',
            description: 'Run a professional automotive repair shop',
            icon: Car,
            color: 'text-blue-600',
            role: UserRole.GARAGE_OWNER,
        },
        {
            id: 'mechanic',
            title: 'Freelance Mechanic',
            description: 'Offer independent automotive services',
            icon: Wrench,
            color: 'text-green-600',
            role: UserRole.FREELANCE_MECHANIC,
        },
        {
            id: 'parts',
            title: 'Spare Parts Shop',
            description: 'Sell automotive parts and accessories',
            icon: Package,
            color: 'text-orange-600',
            role: UserRole.SPAREPARTS_SHOP,
        },
    ];

    const handleUserTypeSelect = (type: string) => {
        const selectedType = userTypes.find(t => t.id === type);
        setUserType(type);
        setFormData(prev => ({
            ...prev,
            role: selectedType?.role || UserRole.CUSTOMER,
        }));
        setStep(2);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBusinessInputChange = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setBusinessData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as any),
                    [child]: value,
                },
            }));
        } else {
            setBusinessData(prev => ({ ...prev, [field]: value }));
        }
    };

    const isBusinessAccount = () => {
        return formData.role !== UserRole.CUSTOMER;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }

            // If it's a business account, proceed to step 3 for business details
            if (isBusinessAccount()) {
                setStep(3);
            } else {
                // For customers, auto sign in after successful registration
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.error) {
                    setError('Account created but failed to sign in. Please try signing in manually.');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBusinessSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // First sign in to get the session
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                throw new Error('Failed to sign in');
            }

            // Then create the business profile
            const businessResponse = await fetch('/api/business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessName: businessData.businessName,
                    description: businessData.description,
                    businessType: formData.role,
                    licenseNumber: businessData.licenseNumber,
                    address: businessData.address,
                    workingHours: businessData.workingHours,
                }),
            });

            if (!businessResponse.ok) {
                const errorData = await businessResponse.json();
                throw new Error(errorData.error || 'Failed to create business profile');
            }

            router.push('/dashboard');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (error) {
            setError('An error occurred during Google sign up');
            setIsLoading(false);
        }
    };

    const [passwordFeedback, setPasswordFeedback] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
    });

    // Add this function before your handleSubmit
    const validatePassword = (password: string) => {
        setPasswordFeedback({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[^A-Za-z0-9]/.test(password),
        });
    };

    const handlePasswordInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'password') {
            validatePassword(value);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                        {/* <Car className="h-8 w-8 text-blue-600" /> */}
                        <Image
                            src="/logo.png"
                            alt="MtokaaHero Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="text-2xl font-bold text-gray-900">MtokaaHero</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MtokaaHero</h1>
                    <p className="text-gray-600">Start growing your automotive business today</p>
                </div>

                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Your Account Type</CardTitle>
                            <CardDescription>Select the option that best describes you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={userType} onValueChange={handleUserTypeSelect}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userTypes.map(type => {
                                        const Icon = type.icon;
                                        return (
                                            <div key={type.id} className="relative">
                                                <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                                                <Label
                                                    htmlFor={type.id}
                                                    className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors"
                                                >
                                                    <Icon className={`h-8 w-8 mb-3 ${type.color}`} />
                                                    <h3 className="font-medium text-gray-900 mb-1">{type.title}</h3>
                                                    <p className="text-sm text-gray-600 text-center">
                                                        {type.description}
                                                    </p>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                )}

                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Your Account</CardTitle>
                            <CardDescription>Enter your details to get started</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={e => handleInputChange('firstName', e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={e => handleInputChange('lastName', e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleInputChange('email', e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => handleInputChange('phone', e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={e => handlePasswordInputChange('password', e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p className={`text-${passwordFeedback.minLength ? 'green' : 'red'}-600`}>
                                            {passwordFeedback.minLength ? '✓' : '✗'} At least 8 characters
                                        </p>
                                        <p className={`text-${passwordFeedback.hasUppercase ? 'green' : 'red'}-600`}>
                                            {passwordFeedback.hasUppercase ? '✓' : '✗'} At least 1 uppercase letter
                                        </p>
                                        <p className={`text-${passwordFeedback.hasLowercase ? 'green' : 'red'}-600`}>
                                            {passwordFeedback.hasLowercase ? '✓' : '✗'} At least 1 lowercase letter
                                        </p>
                                        <p className={`text-${passwordFeedback.hasNumber ? 'green' : 'red'}-600`}>
                                            {passwordFeedback.hasNumber ? '✓' : '✗'} At least 1 number
                                        </p>
                                        <p className={`text-${passwordFeedback.hasSpecial ? 'green' : 'red'}-600`}>
                                            {passwordFeedback.hasSpecial ? '✓' : '✗'} At least 1 special character
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => handleInputChange('confirmPassword', e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="flex-1">
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Account
                                    </Button>
                                </div>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleGoogleSignUp}
                                disabled={isLoading}
                                className="w-full"
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="text-center">
                                <span className="text-sm text-gray-600">Already have an account? </span>
                                <Link href="/auth/signin" className="text-sm text-blue-600 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Details</CardTitle>
                            <CardDescription>Tell us about your business to complete your profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleBusinessSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input
                                        id="businessName"
                                        value={businessData.businessName}
                                        onChange={e => handleBusinessInputChange('businessName', e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="Enter your business name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Business Description</Label>
                                    <textarea
                                        id="description"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={businessData.description}
                                        onChange={e => handleBusinessInputChange('description', e.target.value)}
                                        disabled={isLoading}
                                        placeholder="Describe your business and services"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                                    <Input
                                        id="licenseNumber"
                                        value={businessData.licenseNumber}
                                        onChange={e => handleBusinessInputChange('licenseNumber', e.target.value)}
                                        disabled={isLoading}
                                        placeholder="Business license or registration number"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base font-medium">Business Address</Label>

                                    <div>
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            value={businessData.address.street}
                                            onChange={e => handleBusinessInputChange('address.street', e.target.value)}
                                            required
                                            disabled={isLoading}
                                            placeholder="Enter street address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={businessData.address.city}
                                                onChange={e =>
                                                    handleBusinessInputChange('address.city', e.target.value)
                                                }
                                                required
                                                disabled={isLoading}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State/County</Label>
                                            <Input
                                                id="state"
                                                value={businessData.address.state}
                                                onChange={e =>
                                                    handleBusinessInputChange('address.state', e.target.value)
                                                }
                                                required
                                                disabled={isLoading}
                                                placeholder="State or County"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="zipCode">Postal Code</Label>
                                            <Input
                                                id="zipCode"
                                                value={businessData.address.zipCode}
                                                onChange={e =>
                                                    handleBusinessInputChange('address.zipCode', e.target.value)
                                                }
                                                required
                                                disabled={isLoading}
                                                placeholder="Postal code"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                value={businessData.address.country}
                                                onChange={e =>
                                                    handleBusinessInputChange('address.country', e.target.value)
                                                }
                                                required
                                                disabled={isLoading}
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(2)}
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="flex-1">
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Complete Setup
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
