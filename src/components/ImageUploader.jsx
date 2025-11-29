import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export function ImageUploader({ onImageSelect, isProcessing }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onImageSelect(acceptedFiles[0]);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp']
        },
        maxFiles: 1,
        disabled: isProcessing
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative group cursor-pointer flex flex-col items-center justify-center w-full max-w-xl p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out",
                isDragActive
                    ? "border-blue-500 bg-blue-50/10 scale-[1.02]"
                    : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50",
                isProcessing && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4 text-center">
                <div className={cn(
                    "p-4 rounded-full bg-zinc-800 transition-transform duration-300 group-hover:scale-110",
                    isDragActive && "bg-blue-500/20 text-blue-400"
                )}>
                    {isDragActive ? (
                        <Upload className="w-8 h-8" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-zinc-400" />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-zinc-200">
                        {isDragActive ? "Drop image here" : "Upload an image"}
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-xs">
                        Drag and drop or click to select a PNG, JPG or WebP image
                    </p>
                </div>
            </div>

            {/* Decorative background blur */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
