import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { carId, imageUrl, imageType, order } = body

    const image = await prisma.carImage.create({
      data: {
        carId,
        imageUrl,
        imageType: imageType || 'gallery',
        order: order || 0
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}
