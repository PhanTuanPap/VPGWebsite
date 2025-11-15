import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const testDrives = await prisma.testDrive.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(testDrives)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch test drives' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, phone, carId, carName, testDate } = body

    const testDrive = await prisma.testDrive.create({
      data: {
        fullName,
        phone,
        carId,
        carName,
        testDate: new Date(testDate)
      }
    })

    return NextResponse.json(testDrive)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create test drive' }, { status: 500 })
  }
}
