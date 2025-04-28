import React from 'react';
import { Button } from "@/components/ui/button";

interface ImageTransformProps {
    transformedImage: string | null;
    onDownload: () => void;
}

const ImageTransform: React.FC<ImageTransformProps> = ({ transformedImage, onDownload }) => {
    return (
        <div className="space-y-4">
            {transformedImage ? (
                <div className="space-y-4">
                    <img
                        src={transformedImage}
                        alt="Transformed"
                        className="w-full rounded-lg shadow-md"
                    />
                    <Button
                        onClick={onDownload}
                        className="w-full"
                    >
                        Download Image
                    </Button>
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">
                    Click "Convert Image" to see the result
                </p>
            )}
        </div>
    );
};

export default ImageTransform;