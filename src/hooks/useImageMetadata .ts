import { useEffect, useState } from 'react'

const useImageMetadata = (base64Image: string | null) => {
  const [metadata, setMetadata] = useState<{
    width: number
    height: number
    sizeKB: number
    format: string
  } | null>(null)

  useEffect(() => {
    if (!base64Image) return

    const img = new Image()
    img.onload = () => {
      const sizeBytes = (base64Image.length * (3 / 4)) - (base64Image.endsWith('==') ? 2 : base64Image.endsWith('=') ? 1 : 0)
      const sizeKB = sizeBytes / 1024

      const format = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';')).split('/')[1]

      setMetadata({
        width: img.width,
        height: img.height,
        sizeKB: parseFloat(sizeKB.toFixed(2)),
        format,
      })
    }
    img.src = base64Image
  }, [base64Image])

  return metadata
}
export default useImageMetadata