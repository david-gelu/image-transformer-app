export const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src) // Clean up
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.src = URL.createObjectURL(file)
  })
}