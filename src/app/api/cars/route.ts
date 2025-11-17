import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: {
        versions: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, article, mainImage, versions, tag } = body

    const createData: any = {
      name,
      slug,
      description,
      article,
      mainImage,
    }

    if (typeof tag !== 'undefined') createData.tag = tag

    if (versions) {
      createData.versions = {
        create: versions.map((v: any) => ({ name: v.name, price: v.price }))
      }
    }

    const car = await prisma.car.create({
      data: createData,
      include: { versions: true, images: true }
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
