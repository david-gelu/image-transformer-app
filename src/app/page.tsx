'use client';

import ImageUpload from '@/components/ImageUpload';
import ImageTransform from '@/components/ImageTransform';
import { useState } from 'react';
import { ImageConversionOptions, convertImage, getImageFormat } from '@/utils/imageProcessing';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getImageDimensions } from '@/utils/imageUtils';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [conversionOptions, setConversionOptions] = useState<ImageConversionOptions>({
    format: 'webp',
    quality: 80,
    width: undefined,
    height: undefined,
  });

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setTransformedImage(null);
    const format = await getImageFormat(file);
    setOriginalFormat(format);

    // Get and set image dimensions
    const dimensions = await getImageDimensions(file);
    setConversionOptions(prev => ({
      ...prev,
      width: dimensions.width,
      height: dimensions.height
    }));
  };

  const handleConvert = async () => {
    if (selectedImage) {
      try {
        const converted = await convertImage(selectedImage, conversionOptions);
        setTransformedImage(converted);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }
  };

  const handleDownload = () => {
    if (transformedImage) {
      const link = document.createElement('a');
      link.href = transformedImage;
      link.download = `converted-image.${conversionOptions.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setTransformedImage(null);
  };

  return (
    <main className="home">
      <div className="home__container">
        <ImageUpload
          onImageSelect={handleImageSelect}
          onClose={handleClose}
        />
        {selectedImage && (
          <div className="home__options">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="home__grid">
                  <div className="home__field">
                    <Label htmlFor="format">Format</Label>
                    <Select
                      value={conversionOptions.format}
                      onValueChange={(value) => setConversionOptions({
                        ...conversionOptions,
                        format: value as ImageConversionOptions['format']
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="avif">AVIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="home__field">
                    <Label htmlFor="quality">Quality ({conversionOptions.quality}%)</Label>
                    <Slider
                      id="quality"
                      min={1}
                      max={100}
                      step={1}
                      value={[conversionOptions.quality || 80]}
                      onValueChange={(value) => setConversionOptions({
                        ...conversionOptions,
                        quality: value[0]
                      })}
                    />
                  </div>
                  <div className="home__dimensions">
                    <div className="home__field">
                      <Label htmlFor="width">Width (pixels)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={conversionOptions.width || ''}
                        onChange={(e) => setConversionOptions({
                          ...conversionOptions,
                          width: e.target.value ? Number(e.target.value) : undefined
                        })}
                        placeholder="Width in pixels"
                      />
                    </div>
                    <div className="home__field">
                      <Label htmlFor="height">Height (pixels)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={conversionOptions.height || ''}
                        onChange={(e) => setConversionOptions({
                          ...conversionOptions,
                          height: e.target.value ? Number(e.target.value) : undefined
                        })}
                        placeholder="Height in pixels"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="home__convert-button"
                  onClick={handleConvert}
                >
                  Convert Image
                </Button>
              </CardContent>
            </Card>
            {transformedImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageTransform
                    transformedImage={transformedImage}
                    onDownload={handleDownload}
                  />
                </CardContent>
              </Card>)}
          </div>
        )}
      </div>
    </main>
  );
}