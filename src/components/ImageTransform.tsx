import React from 'react'
import { Button } from "@/components/ui/button"

interface ImageTransformProps {
    transformedImage: string | null
    onDownload: () => void
}

const ImageTransform: React.FC<ImageTransformProps> = ({ transformedImage, onDownload }) => {
    return (
        <div className="image-transform">
            {transformedImage ? (
                <div className="image-transform__content">
                    <img
                        src={transformedImage}
                        alt="Transformed"
                        className="image-transform__image"
                    />
                    <Button
                        onClick={onDownload}
                        className="image-transform__button"
                    >
                        Download Image
                    </Button>
                </div>
            ) : (
                <p className="image-transform__placeholder">
                    Click "Convert Image" to see the result
                </p>
            )}
        </div>
    )
}

export default ImageTransform