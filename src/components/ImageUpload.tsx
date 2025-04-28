import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from './ui/input';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageSelect,
    acceptedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

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

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            onImageSelect(file);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "relative border-2 border-dashed rounded-lg p-8 text-center",
                        dragActive
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : error
                                ? "border-destructive"
                                : "border-muted hover:border-primary",
                        "transition-all duration-150 ease-in-out"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Input
                        type="file"
                        accept={acceptedFormats.join(',')}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Upload file"
                        disabled={isLoading}
                    />
                    <div className="space-y-4">
                        <UploadCloud
                            className={cn(
                                "mx-auto h-12 w-12",
                                dragActive
                                    ? "text-primary"
                                    : error
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                            )}
                        />
                        {isLoading ? (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Processing...</p>
                                <Progress value={100} className="w-full" />
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                {selectedFile ? (
                                    <div className="space-y-2">
                                        <p className="text-primary font-medium">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-medium">
                                            Drag and drop your image here
                                        </p>
                                        <p className="text-sm">or</p>
                                        <p className="text-primary font-medium">
                                            Click to browse
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageUpload;