import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { identifier } = await request.json();

        if (!identifier) {
            return NextResponse.json(
                { error: 'Email or phone number is required' },
                { status: 400 }
            );
        }

        // Check if user exists by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                ],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                business: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({
                exists: false,
                user: null,
                hasBusiness: false,
            });
        }

        return NextResponse.json({
            exists: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            hasBusiness: !!user.business,
        });
    } catch (error) {
        console.error('Error checking user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
