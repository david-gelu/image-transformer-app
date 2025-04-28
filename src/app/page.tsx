'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import ImageTransform from '@/components/ImageTransform';
import { useState, useEffect } from 'react';
import { ImageConversionOptions, convertImage, getImageFormat } from '@/utils/imageProcessing';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from "lucide-react";
import { BallLoader } from "@/components/ui/loader";

const estimateConversionTime = (file: File) => {
  const sizeInMB = file.size / (1024 * 1024);
  // Base time of 1 second + 0.5 seconds per MB
  return Math.max(1, Math.ceil(1 + (sizeInMB * 0.5)));
};
const MotionCard = motion(Card);
const MotionProgress = motion.div;

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
  const [keepAspectRatio, setKeepAspectRatio] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isConverting) {
      setProgress(0);
      setEstimatedTime(3); // 3 seconds estimated time

      timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (estimatedTime * 10)); // Update 10 times per second
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
      setProgress(0);
    };
  }, [isConverting, estimatedTime]);

  const handleAspectRatioChange = (checked: boolean) => {
    setKeepAspectRatio(checked);
    if (checked && selectedImage) {
      // Maintain aspect ratio when changing dimensions
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);
      img.onload = () => {
        const ratio = img.width / img.height;
        setConversionOptions(prev => ({
          ...prev,
          height: prev.width ? Math.round(prev.width / ratio) : undefined
        }));
      };
    }
  };

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

  const validateDimensions = (width?: number, height?: number) => {
    const MAX_DIMENSION = 12000; // Maximum allowed dimension
    if (width && width > MAX_DIMENSION) {
      throw new Error(`Width cannot exceed ${MAX_DIMENSION} pixels`);
    }
    if (height && height > MAX_DIMENSION) {
      throw new Error(`Height cannot exceed ${MAX_DIMENSION} pixels`);
    }
  };

  const handleConvert = async () => {
    if (selectedImage) {
      try {
        setError(null);
        setIsConverting(true);
        setProgress(0);

        // Validate dimensions before converting
        validateDimensions(conversionOptions.width, conversionOptions.height);

        // Start progress animation
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + 1;
            return newProgress < 95 ? newProgress : 95;
          });
        }, 50);

        // Perform conversion
        const converted = await convertImage(selectedImage, conversionOptions);
        setTransformedImage(converted);

        // Complete progress
        setProgress(100);
        clearInterval(progressInterval);

      } catch (error) {
        console.error('Error converting image:', error);
        setError(error instanceof Error ? error.message : 'Failed to convert image');
      } finally {
        setTimeout(() => {
          setIsConverting(false);
          setProgress(0);
        }, 500); // Give time for completion animation
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

  const handleWidthChange = (width: number) => {
    // Allow empty or zero values
    if (isNaN(width)) {
      setConversionOptions(prev => ({ ...prev, width: undefined }));
      return;
    }

    if (keepAspectRatio && selectedImage) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);
      img.onload = () => {
        const ratio = img.width / img.height;
        setConversionOptions(prev => ({
          ...prev,
          width,
          height: width ? Math.round(width / ratio) : undefined
        }));
        URL.revokeObjectURL(img.src); // Clean up the object URL
      };
    } else {
      setConversionOptions(prev => ({ ...prev, width }));
    }
  };

  const handleHeightChange = (height: number) => {
    // Allow empty or zero values
    if (isNaN(height)) {
      setConversionOptions(prev => ({ ...prev, height: undefined }));
      return;
    }

    if (keepAspectRatio && selectedImage) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);
      img.onload = () => {
        const ratio = img.width / img.height;
        setConversionOptions(prev => ({
          ...prev,
          width: height ? Math.round(height * ratio) : undefined,
          height
        }));
        URL.revokeObjectURL(img.src); // Clean up the object URL
      };
    } else {
      setConversionOptions(prev => ({ ...prev, height }));
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="home">
      <div className="home__container">
        <ImageUpload
          onImageSelect={handleImageSelect}
          onClose={handleClose}
        />
        <AnimatePresence mode="wait">
          {selectedImage && (
            <motion.div className="home__options">
              <MotionCard variants={cardVariants} transition={{ delay: 0.2 }}>
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
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          placeholder="Width in pixels"
                        />
                      </div>
                      <div className="home__field">
                        <Label htmlFor="height">Height (pixels)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={conversionOptions.height || ''}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          placeholder="Height in pixels"
                        />
                      </div>
                      <div className="home__field home__field--checkbox">
                        <div className="checkbox-wrapper">
                          <Checkbox
                            id="keepAspectRatio"
                            checked={keepAspectRatio}
                            onCheckedChange={(checked) =>
                              handleAspectRatioChange(checked as boolean)
                            }
                          />
                          <Label htmlFor="keepAspectRatio" className="checkbox-label">
                            Maintain aspect ratio
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="home__convert">
                    <AnimatePresence mode="wait">
                      {error && (
                        <MotionProgress
                          className="home__error"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="home__error-content">
                            <AlertCircle className="home__error-icon" />
                            <p className="home__error-text">{error}</p>
                          </div>
                        </MotionProgress>
                      )}
                      {isConverting && (
                        <MotionProgress
                          className="home__progress"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {progress < 95 ? (
                            <>
                              <Progress
                                value={progress}
                                className="home__progress-bar"
                              />
                              <p className="home__progress-text">
                                Converting... {Math.round(progress)}%
                              </p>
                            </>
                          ) : (
                            <div className="home__finalizing">
                              <BallLoader />
                              <p className="home__progress-text">
                                Finalizing...
                              </p>
                            </div>
                          )}
                        </MotionProgress>
                      )}
                    </AnimatePresence>
                    <Button
                      className="home__convert-button"
                      onClick={handleConvert}
                      disabled={isConverting}
                    >
                      {isConverting ? 'Converting...' : 'Convert Image'}
                    </Button>
                  </div>
                </CardContent>
              </MotionCard>
              <AnimatePresence>
                {transformedImage && (
                  <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: 0.3 }}
                  >
                    <CardHeader>
                      <CardTitle>Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ImageTransform
                        transformedImage={transformedImage}
                        onDownload={handleDownload}
                      />
                    </CardContent>
                  </MotionCard>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}