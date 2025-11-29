import React, { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { Loader2, Sparkles } from 'lucide-react';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = useCallback(async (file) => {
    setOriginalImage(file);
    setIsProcessing(true);
    setError(null);

    try {
      // Configure to use public assets if needed, but default usually works
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          console.log(`Downloading ${key}: ${current} of ${total}`);
        }
      });
      setProcessedImage(blob);
    } catch (err) {
      console.error("Background removal failed:", err);
      setError("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Background Image Remover
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="w-full max-w-4xl flex flex-col items-center gap-8 z-10">
          {!originalImage ? (
            <>
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Remove Backgrounds <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Instantly & Free
                  </span>
                </h2>
              </div>
              <ImageUploader onImageSelect={handleImageSelect} isProcessing={isProcessing} />
            </>
          ) : (
            <>
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4 p-12">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-zinc-400 animate-pulse">Processing image...</p>
                  <p className="text-xs text-zinc-500">First run may take a moment to load models</p>
                </div>
              ) : (
                <ResultViewer
                  originalImage={originalImage}
                  processedImage={processedImage}
                  onReset={handleReset}
                />
              )}
            </>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-zinc-600 text-sm">
        <p>© 2025 Background Image Remover.</p>
      </footer>
    </div>
  );
}

export default App;
