import React, { useState } from 'react';
import { Download, RefreshCw, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export function ResultViewer({ originalImage, processedImage, onReset }) {
    const [showOriginal, setShowOriginal] = useState(false);

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(processedImage);
        link.download = 'removed-background.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const imageUrl = processedImage ? URL.createObjectURL(processedImage) : null;
    const originalUrl = originalImage ? URL.createObjectURL(originalImage) : null;

    return (
        <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-500">
            <div className="relative rounded-3xl overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-900 shadow-2xl border border-zinc-800">

                {/* Toolbar */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={() => setShowOriginal(!showOriginal)}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-colors"
                        title={showOriginal ? "Show Result" : "Show Original"}
                    >
                        <Layers className="w-5 h-5" />
                    </button>
                </div>

                {/* Image Display */}
                <div className="relative aspect-video flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] bg-repeat">
                    {originalUrl && (
                        <img
                            src={showOriginal ? originalUrl : imageUrl}
                            alt="Result"
                            className="max-h-full max-w-full object-contain"
                        />
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-between">
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Start Over</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download PNG</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
