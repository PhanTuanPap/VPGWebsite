import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendZaloOAToAdmin } from '@/lib/zalo'

export async function GET() {
  try {
    const priceQuotes = await prisma.priceQuote.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(priceQuotes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch price quotes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, phone, carId, carName, paymentType } = body

    const priceQuote = await prisma.priceQuote.create({
      data: {
        fullName,
        phone,
        carId,
        carName,
        paymentType
      }
    })

    // Notify admin via Zalo OA (best-effort)
    try {
      const msg = `YÊU CẦU BÁO GIÁ mới\nTên: ${fullName}\nSĐT: ${phone}\nXe: ${carName || carId}\nHình thức: ${paymentType || 'Chưa chọn'}`
      await sendZaloOAToAdmin(msg)
    } catch (err) {
      console.error('Failed to notify admin via Zalo OA', err)
    }

    return NextResponse.json(priceQuote)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create price quote' }, { status: 500 })
  }
}
