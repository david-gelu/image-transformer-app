export interface ImageConversionOptions {
    format: 'jpeg' | 'png' | 'webp' | 'avif' | 'gif'
    quality?: number
    width?: number
    height?: number
}

export const getImageFormat = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'
    return extension
}

export const convertImage = async (
    file: File,
    options: ImageConversionOptions
): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('format', options.format)
    if (options.quality) formData.append('quality', options.quality.toString())
    if (options.width) formData.append('width', options.width.toString())
    if (options.height) formData.append('height', options.height.toString())

    const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Image conversion failed')
    }

    const result = await response.json()
    return result.data.replace(/^data:image\/(.*?)(?<!;)(base64,)/, 'data:image/$1;$2')
}