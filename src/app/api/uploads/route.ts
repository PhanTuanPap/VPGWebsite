import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function GET() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return NextResponse.json([])
    }

    const files = fs.readdirSync(UPLOAD_DIR).filter(f => !f.startsWith('.'))

    // find which files are referenced in CarImage.imageUrl
    const images = await prisma.carImage.findMany({ select: { imageUrl: true } })
    const usedUrls = new Set(images.map(i => i.imageUrl))

    const list = files.map(f => {
      const rel = `/uploads/${f}`
      return { name: f, url: rel, used: usedUrls.has(rel), size: fs.statSync(path.join(UPLOAD_DIR, f)).size }
    })

    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read uploads' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json()
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

    const filePath = path.join(UPLOAD_DIR, name)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Prevent deleting if file is used in DB
    const rel = `/uploads/${name}`
    const used = await prisma.carImage.findFirst({ where: { imageUrl: rel } })
    if (used) {
      return NextResponse.json({ error: 'File is used by a CarImage' }, { status: 400 })
    }

    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
