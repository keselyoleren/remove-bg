import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export function ImageUploader({ onImageSelect, isProcessing }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onImageSelect(acceptedFiles);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp'],
            'image/heic': ['.heic'],
            'image/heif': ['.heif']
        },
        disabled: isProcessing
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative group cursor-pointer flex flex-col items-center justify-center w-full max-w-xl p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out bg-zinc-800/50 backdrop-blur-sm",
                isDragActive
                    ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
                    : "border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800",
                isProcessing && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4 text-center z-10">
                <div className={cn(
                    "p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm transition-transform duration-300 group-hover:scale-110",
                    isDragActive && "bg-purple-500 text-white border-purple-500"
                )}>
                    {isDragActive ? (
                        <Upload className="w-8 h-8" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
                        {isDragActive ? "Drop images here" : "Upload images"}
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-xs font-medium">
                        Drag and drop or click to select PNG, JPG, WebP or HEIC images
                    </p>
                </div>
            </div>

            {/* Decorative background blur */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
