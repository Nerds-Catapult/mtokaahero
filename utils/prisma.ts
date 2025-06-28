import { PrismaClient } from '@/lib/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())


export default prisma