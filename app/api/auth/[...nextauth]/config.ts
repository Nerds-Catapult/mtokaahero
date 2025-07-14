import { handleAuthError } from '@/lib/auth-errors';
import { UserRole } from '@/lib/generated/prisma';
import prisma from '@/utils/prisma';
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    // Commented out PrismaAdapter temporarily to avoid conflicts with Prisma Accelerate
    // adapter: PrismaAdapter(prisma),
    providers: [
        // GoogleProvider({
        //   clientId: process.env.GOOGLE_CLIENT_ID!,
        //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                try {
                    // Find user by email
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        throw new Error('No account found with this email address');
                    }

                    // Check if user is active
                    if (!user.isActive) {
                        throw new Error('Your account has been deactivated. Please contact support.');
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    }

                    // Return user data
                    return {
                        id: user.id,
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        avatar: user.avatar,
                        isVerified: user.isVerified,
                        isActive: user.isActive,
                    };
                } catch (error: any) {
                    console.error('Authorization error:', error);

                    // Handle specific error messages
                    if (error.message.includes('No account found')) {
                        throw new Error('No account found with this email address');
                    } else if (error.message.includes('Invalid password')) {
                        throw new Error('Incorrect password');
                    } else if (error.message.includes('deactivated')) {
                        throw error; // Pass through deactivation message
                    } else {
                        // Handle database errors with better messaging
                        const authError = handleAuthError(error);
                        throw new Error(authError.message);
                    }
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.isVerified = user.isVerified;
                token.isActive = user.isActive;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!;
                session.user.role = token.role as UserRole;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isActive = token.isActive as boolean;
                session.user.name = `${token.firstName} ${token.lastName}`;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
