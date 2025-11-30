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
                    className="relative flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all duration-300"
                >
                    {/* Image Preview */}
                    <div className="relative w-20 h-20 shrink-0 bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-700/50">
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
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Info & Progress */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-zinc-200 truncate pr-4">
                                {image.file.name}
                            </h4>
                            <span className={cn(
                                "text-xs font-bold px-2.5 py-1 rounded-full",
                                image.status === 'completed' && "bg-green-500/10 text-green-400 border border-green-500/20",
                                image.status === 'error' && "bg-red-500/10 text-red-400 border border-red-500/20",
                                image.status === 'processing' && "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                                image.status === 'pending' && "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            )}>
                                {image.status === 'completed' && "Done"}
                                {image.status === 'error' && "Failed"}
                                {image.status === 'processing' && "Processing"}
                                {image.status === 'pending' && "Pending"}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        {image.status === 'processing' && (
                            <div className="space-y-1.5">
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                                        style={{ width: `${image.progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 text-right font-medium">{image.progress}%</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {image.status === 'error' && (
                            <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {image.error || "Failed to process"}
                            </p>
                        )}

                        {/* Success Message */}
                        {image.status === 'completed' && (
                            <p className="text-xs text-green-400 flex items-center gap-1.5 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Background removed
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {image.status === 'completed' && (
                            <button
                                onClick={() => onDownload(image)}
                                className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => onRemove(image.id)}
                            className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
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
