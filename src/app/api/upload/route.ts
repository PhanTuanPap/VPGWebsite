import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, isAbsolute } from 'path'
import { existsSync } from 'fs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine uploads directory from env or default to ./public/uploads
    // If UPLOADS_DIR is absolute (starts with '/'), use it as absolute path.
    // Otherwise treat it relative to process.cwd().
    const configured = process.env.UPLOADS_DIR || join('public', 'uploads')
    const uploadsDir = isAbsolute(configured) ? configured : join(process.cwd(), configured)

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/\s/g, '-')}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    // Compute public-facing URL. If configured path is inside public folder,
    // return path relative to public (starts with '/'). If uploadsDir is an
    // absolute non-public path (e.g. '/uploads'), return path based on the
    // configured mount point's public URL (we assume same format).
    let publicUrl: string
    const normalizedConfigured = configured.replace(/\\/g, '/')
    if (normalizedConfigured.startsWith('public/')) {
      publicUrl = '/' + normalizedConfigured.replace(/^public\//, '') + `/${filename}`
    } else if (isAbsolute(configured)) {
      // If absolute path like '/uploads', use that as public URL root
      publicUrl = (configured.endsWith('/') ? configured.slice(0, -1) : configured) + `/${filename}`
    } else {
      // relative but not under public, assume it's mounted at root (e.g. 'uploads')
      publicUrl = '/' + normalizedConfigured.replace(/^\.\//, '') + `/${filename}`
    }

    return NextResponse.json({
      url: publicUrl,
      filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
