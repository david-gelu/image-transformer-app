import React, { useRef } from 'react';
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from './ui/card';
import { Progress } from "@/components/ui/progress";
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ImageUploadProps {
    onImageSelect: (file: File) => Promise<void>;
    onClose?: () => void;
    acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageSelect,
    onClose,
    acceptedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [dragActive, setDragActive] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    const validateFile = (file: File): boolean => {
        const fileType = file.type.split('/')[1];
        const isValidType = acceptedFormats.some(format =>
            format.toLowerCase().includes(fileType.toLowerCase())
        );

        if (!isValidType) {
            setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
            return false;
        }

        setError('');
        return true;
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setError('');
                setIsLoading(true);
                if (validateFile(file)) {
                    setSelectedFile(file);
                    await onImageSelect(file);
                }
            } catch (error) {
                setError('Failed to process image');
                console.error('Error processing image:', error);
            } finally {
                setIsLoading(false);
                // Reset the input value to allow selecting the same file again
                event.target.value = '';
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            try {
                setError('');
                setIsLoading(true);
                if (validateFile(file)) {
                    setSelectedFile(file);
                    await onImageSelect(file);
                }
            } catch (error) {
                setError('Failed to process image');
                console.error('Error processing image:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCloseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setSelectedFile(null);
        setError('');
        onClose?.();
    };

    const handleZoneClick = () => {
        if (!isLoading) {
            // Clear the input value before clicking to ensure change event fires
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fileInputRef.current?.click();
        }
    };

    // Update renderContent to always allow clicks
    const renderContent = () => {
        if (isLoading) {
            return (
                <MotionContent
                    className="upload-zone__content"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Upload className="upload-zone__icon" />
                    <h3 className="upload-zone__title">Processing image...</h3>
                    <div className="upload-zone__progress">
                        <Progress
                            value={100}
                            indeterminate
                            className="upload-zone__progress-bar"
                        />
                    </div>
                </MotionContent>
            );
        }

        // Even when file is selected, allow clicking for new upload
        return (
            <MotionContent
                className="upload-zone__content"
                onClick={handleZoneClick}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {selectedFile && !error ? (
                    <>
                        <Upload className="upload-zone__icon" />
                        <h3 className="upload-zone__title">Upload complete!</h3>
                        <p className="upload-zone__text">
                            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        <p className="upload-zone__text">
                            Click or drop to replace
                        </p>
                    </>
                ) : (
                    <>
                        <Upload className="upload-zone__icon" />
                        <h3 className="upload-zone__title">Drag & drop files here</h3>
                        <p className="upload-zone__text">
                            Or click to browse
                        </p>
                    </>
                )}
            </MotionContent>
        );
    };

    const contentVariants = {
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
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const MotionContent = motion.div;

    return (
        <Card className="upload">
            <Input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleFileChange}
                className="upload-zone__input"
                aria-label="Upload file"
                disabled={isLoading}
                tabIndex={-1}
            />
            <div className="upload-header">
                <h2 className="upload-header__title">Upload image</h2>
                <Button
                    className="upload-__close"
                    onClick={handleCloseClick}
                    type="button"
                    aria-label="Close upload"
                >
                    <X size={20} />
                </Button>
            </div>
            <CardContent className="p-0">
                <div
                    className={`upload-zone ${dragActive ? 'upload-zone--active' :
                        error ? 'upload-zone--error' : ''
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageUpload;