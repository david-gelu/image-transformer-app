import React, { useRef } from 'react';
import { Upload, X } from "lucide-react";
import { Card, CardContent } from './ui/card';

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
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (validateFile(file)) {
                setIsLoading(true);
                setSelectedFile(file);
                await onImageSelect(file);
                setIsLoading(false);
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
            if (validateFile(file)) {
                setIsLoading(true);
                setSelectedFile(file);
                await onImageSelect(file);
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
        fileInputRef.current?.click();
    };

    return (
        <Card className="upload">
            <div className="upload-header">
                <h2 className="upload-header__title">Basic</h2>
                <button
                    className="upload-header__close"
                    onClick={handleCloseClick}
                    type="button"
                    aria-label="Close upload"
                >
                    <X size={20} />
                </button>
            </div>
            <p className="upload-subtitle">
                Basic controlled file upload.
            </p>
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
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedFormats.join(',')}
                        onChange={handleFileChange}
                        className="upload-zone__input"
                        aria-label="Upload file"
                        disabled={isLoading}
                    />
                    <div className="upload-zone__content" onClick={handleZoneClick}>
                        <Upload className="upload-zone__icon" />
                        <h3 className="upload-zone__title">Drag & drop files here</h3>
                        <p className="upload-zone__text">
                            Or click to browse (max 2 files, up to 5MB each)
                        </p>
                        <button type="button" className="upload-zone__browse">
                            Browse files
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageUpload;