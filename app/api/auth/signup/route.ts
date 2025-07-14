import { authSchemas, handleAuthError, validateAuthInput } from '@/lib/auth-errors';
import { UserRole } from '@/lib/generated/prisma';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input using the new auth error handling
        const validation = validateAuthInput(authSchemas.signup, body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.message, code: validation.error.code, field: validation.error.field },
                { status: validation.error.statusCode },
            );
        }

        const { email, password, firstName, lastName, phone, role } = validation.data;

        // Check if user already exists (this will be caught by Prisma constraint error if we miss it)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, ...(phone ? [{ phone }] : [])],
            },
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'phone';
            const message =
                field === 'email'
                    ? 'An account with this email address already exists'
                    : 'An account with this phone number already exists';

            return NextResponse.json({ error: message, code: 'DUPLICATE_FIELD', field }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone: phone || null, // Ensure empty string becomes null
                role: role || UserRole.CUSTOMER,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        // Create customer profile if role is CUSTOMER
        if (user.role === UserRole.CUSTOMER) {
            await prisma.customer.create({
                data: {
                    userId: user.id,
                },
            });
        }

        return NextResponse.json(
            {
                message: 'Account created successfully! You can now sign in.',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        const authError = handleAuthError(error);
        return NextResponse.json(
            {
                error: authError.message,
                code: authError.code,
                ...(authError.field && { field: authError.field }),
            },
            { status: authError.statusCode },
        );
    }
}
