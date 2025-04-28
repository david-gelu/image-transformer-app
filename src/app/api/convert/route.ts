import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const format = formData.get('format') as string
    const quality = Number(formData.get('quality'))
    const width = Number(formData.get('width')) || undefined
    const height = Number(formData.get('height')) || undefined

    const buffer = Buffer.from(await file.arrayBuffer())
    let sharpImage = sharp(buffer)

    if (width || height) {
      sharpImage = sharpImage.resize(width, height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
    }

    const convertOptions: any = {}
    if (quality) {
      if (format === 'jpeg' || format === 'webp') {
        convertOptions.quality = quality
      } else if (format === 'png') {
        convertOptions.compressionLevel = Math.floor((100 - quality) / 10)
      }
    }

    const outputBuffer = await (sharpImage[format as keyof typeof sharpImage] as Function)(convertOptions).toBuffer()
    const base64Image = outputBuffer.toString('base64')

    return NextResponse.json({
      data: `data:image/${format}base64,${base64Image}`
    })
  } catch (error) {
    return NextResponse.json({ error: 'Image conversion failed' }, { status: 500 })
  }
}