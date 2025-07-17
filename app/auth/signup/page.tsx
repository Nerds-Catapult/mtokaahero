'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/lib/generated/prisma';
import { Car, CheckCircle2, Loader2, Package, User, Wrench, XCircle } from 'lucide-react';
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
    const [showCompleteBusinessDialog, setShowCompleteBusinessDialog] = useState(false);
    const [existingUserEmail, setExistingUserEmail] = useState('');
    const [existingUserData, setExistingUserData] = useState<any>(null);
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

    const checkExistingUser = async (emailOrPhone: string) => {
        try {
            const response = await fetch('/api/auth/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: emailOrPhone }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking user:', error);
            return null;
        }
    };

    const handleCompleteBusinessSetup = async () => {
        setIsLoading(true);
        setError('');
        try {
            const userData = await checkExistingUser(existingUserEmail);
            if (!userData.exists) {
                setError('No account found with this email/phone. Please create a new account.');
                setIsLoading(false);
                return;
            }
            if (userData.hasBusiness) {
                setError('This account already has a business profile. Please sign in instead.');
                setIsLoading(false);
                return;
            }
            if (userData.user.role === UserRole.CUSTOMER) {
                setError('This is a customer account. Business features are not available.');
                setIsLoading(false);
                return;
            }

            setExistingUserData(userData.user);
            setFormData(prev => ({
                ...prev,
                firstName: userData.user.firstName,
                lastName: userData.user.lastName,
                email: userData.user.email,
                phone: userData.user.phone || '',
                role: userData.user.role,
            }));
            setShowCompleteBusinessDialog(false);
            setStep(3);
        } catch (error) {
            setError('An error occurred while checking your account.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

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
            const existingUser = await checkExistingUser(formData.email);
            if (existingUser?.exists) {
                if (isBusinessAccount() && !existingUser.hasBusiness && existingUser.user.role !== UserRole.CUSTOMER) {
                    setExistingUserData(existingUser.user);
                    setStep(3);
                    setIsLoading(false);
                    return;
                } else {
                    setError('An account with this email already exists. Please sign in instead.');
                    setIsLoading(false);
                    return;
                }
            }

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

            if (isBusinessAccount()) {
                setStep(3);
            } else {
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
            let signInResult;
            if (existingUserData) {
                const password = prompt('Please enter your password to continue:');
                if (!password) {
                    setError('Password is required to continue');
                    setIsLoading(false);
                    return;
                }
                signInResult = await signIn('credentials', {
                    email: formData.email,
                    password: password,
                    redirect: false,
                });
            } else {
                signInResult = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });
            }

            if (signInResult?.error) {
                throw new Error('Failed to sign in. Please check your credentials.');
            }

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

    const PasswordRequirement = ({ met, children }: { met: boolean; children: React.ReactNode }) => (
        <p className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-red-600'}`}>
            {met ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {children}
        </p>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-6">
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
                                                    className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-900 peer-checked:border-gray-900 peer-checked:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
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
                                    <div className={`mt-2 space-y-1 ${formData.password.length === 0 ? 'hidden' : ''}`}>
                                        <PasswordRequirement met={passwordFeedback.minLength}>
                                            At least 8 characters
                                        </PasswordRequirement>
                                        <PasswordRequirement met={passwordFeedback.hasUppercase}>
                                            At least 1 uppercase letter
                                        </PasswordRequirement>
                                        <PasswordRequirement met={passwordFeedback.hasLowercase}>
                                            At least 1 lowercase letter
                                        </PasswordRequirement>
                                        <PasswordRequirement met={passwordFeedback.hasNumber}>
                                            At least 1 number
                                        </PasswordRequirement>
                                        <PasswordRequirement met={passwordFeedback.hasSpecial}>
                                            At least 1 special character
                                        </PasswordRequirement>
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
                            <div className="text-center mt-4">
                                <span className="text-sm text-gray-600">Already have an account? </span>
                                <Link href="/auth/signin" className="text-sm text-gray-900 hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                            <div className="text-center border-t pt-4 mt-6">
                                <p className="text-sm text-gray-600 mb-3">
                                    Already have a business account but haven't completed setup?
                                </p>
                                <Dialog open={showCompleteBusinessDialog} onOpenChange={setShowCompleteBusinessDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full bg-transparent">
                                            Complete Business Setup
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Complete Business Setup</DialogTitle>
                                            <DialogDescription>
                                                Enter your email or phone number to continue setting up your business
                                                profile.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            {error && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>{error}</AlertDescription>
                                                </Alert>
                                            )}
                                            <div>
                                                <Label htmlFor="existingEmail">Email or Phone Number</Label>
                                                <Input
                                                    id="existingEmail"
                                                    type="text"
                                                    value={existingUserEmail}
                                                    onChange={e => setExistingUserEmail(e.target.value)}
                                                    placeholder="Enter your email or phone number"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowCompleteBusinessDialog(false);
                                                        setExistingUserEmail('');
                                                        setError('');
                                                    }}
                                                    disabled={isLoading}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleCompleteBusinessSetup}
                                                    disabled={isLoading || !existingUserEmail}
                                                    className="flex-1"
                                                >
                                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Continue
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {existingUserData ? 'Complete Your Business Setup' : 'Business Details'}
                            </CardTitle>
                            <CardDescription>
                                {existingUserData
                                    ? 'Complete your business profile to start using all features'
                                    : 'Tell us about your business to complete your profile'}
                            </CardDescription>
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
