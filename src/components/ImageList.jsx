import React from 'react';
import { Download, Loader2, X, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export function ImageList({ images, onRemove, onDownload }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full max-w-4xl space-y-4">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="relative flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors"
                >
                    {/* Image Preview */}
                    <div className="relative w-20 h-20 shrink-0 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
                        {image.previewUrl || image.processedUrl ? (
                            <img
                                src={image.processedUrl || image.previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-zinc-600" />
                        )}
                        {image.status === 'processing' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Info & Progress */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-zinc-200 truncate pr-4">
                                {image.file.name}
                            </h4>
                            <span className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                image.status === 'completed' && "bg-green-500/10 text-green-400",
                                image.status === 'error' && "bg-red-500/10 text-red-400",
                                image.status === 'processing' && "bg-blue-500/10 text-blue-400",
                                image.status === 'pending' && "bg-zinc-500/10 text-zinc-400"
                            )}>
                                {image.status === 'completed' && "Done"}
                                {image.status === 'error' && "Failed"}
                                {image.status === 'processing' && "Processing"}
                                {image.status === 'pending' && "Pending"}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        {image.status === 'processing' && (
                            <div className="space-y-1">
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${image.progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 text-right">{image.progress}%</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {image.status === 'error' && (
                            <p className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {image.error || "Failed to process"}
                            </p>
                        )}

                        {/* Success Message */}
                        {image.status === 'completed' && (
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Background removed
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {image.status === 'completed' && (
                            <button
                                onClick={() => onDownload(image)}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => onRemove(image.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
