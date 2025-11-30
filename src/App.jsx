import React, { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import heic2any from 'heic2any';
import { ImageUploader } from './components/ImageUploader';
import { ImageList } from './components/ImageList';
import { Sparkles, Trash2, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (imageObj) => {
    try {
      let imageToProcess = imageObj.file;

      // Handle HEIC conversion
      if (imageObj.file.type === 'image/heic' || imageObj.file.type === 'image/heif' || imageObj.file.name.toLowerCase().endsWith('.heic')) {
        const convertedBlob = await heic2any({
          blob: imageObj.file,
          toType: 'image/jpeg',
          quality: 0.8
        });
        imageToProcess = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

        // Update preview URL for HEIC
        const convertedUrl = URL.createObjectURL(imageToProcess);
        setImages(prev => prev.map(img =>
          img.id === imageObj.id
            ? { ...img, previewUrl: convertedUrl }
            : img
        ));
      }

      const blob = await removeBackground(imageToProcess, {
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100);
          setImages(prev => prev.map(img =>
            img.id === imageObj.id
              ? { ...img, progress: percent }
              : img
          ));
        }
      });

      const processedUrl = URL.createObjectURL(blob);
      setImages(prev => prev.map(img =>
        img.id === imageObj.id
          ? { ...img, status: 'completed', processedBlob: blob, processedUrl, progress: 100 }
          : img
      ));

    } catch (err) {
      console.error("Background removal failed:", err);
      setImages(prev => prev.map(img =>
        img.id === imageObj.id
          ? { ...img, status: 'error', error: "Failed to process" }
          : img
      ));
    }
  };

  const handleImageSelect = useCallback(async (files) => {
    setIsProcessing(true);

    const newImages = Array.from(files).map(file => {
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic');
      return {
        id: uuidv4(),
        file,
        previewUrl: isHeic ? null : URL.createObjectURL(file),
        status: 'pending', // pending, processing, completed, error
        progress: 0,
        processedBlob: null,
        error: null
      };
    });

    setImages(prev => [...prev, ...newImages]);

    // Process images sequentially or in parallel? Let's do parallel for now but maybe limit concurrency if needed.
    // For simplicity, let's just trigger them all.

    // Update status to processing for new images
    setImages(prev => prev.map(img =>
      newImages.find(newImg => newImg.id === img.id)
        ? { ...img, status: 'processing' }
        : img
    ));

    await Promise.all(newImages.map(img => processImage(img)));

    setIsProcessing(false);
  }, []);

  const handleRemoveImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove?.previewUrl) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      if (imageToRemove?.processedUrl) {
        URL.revokeObjectURL(imageToRemove.processedUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleDownload = (image) => {
    if (!image.processedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(image.processedBlob);
    link.download = `removed-bg-${image.file.name.split('.')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    images.forEach(img => {
      if (img.status === 'completed') {
        handleDownload(img);
      }
    });
  };

  const handleClearAll = () => {
    images.forEach(img => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img.processedUrl) URL.revokeObjectURL(img.processedUrl);
    });
    setImages([]);
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
      <main className="flex-1 flex flex-col items-center p-6 relative overflow-y-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none fixed" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none fixed" />

        <div className="w-full max-w-4xl flex flex-col items-center gap-8 z-10 pb-20">
          <div className="text-center space-y-4 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Remove Backgrounds <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Instantly & Free
              </span>
            </h2>
          </div>

          <ImageUploader onImageSelect={handleImageSelect} isProcessing={isProcessing} />

          {images.length > 0 && (
            <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-medium text-zinc-300">
                  Processed Images ({images.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                  <button
                    onClick={handleDownloadAll}
                    disabled={!images.some(img => img.status === 'completed')}
                    className="flex items-center gap-2 px-4 py-1.5 text-sm bg-zinc-100 text-zinc-900 font-medium rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download All
                  </button>
                </div>
              </div>

              <ImageList
                images={images}
                onRemove={handleRemoveImage}
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-zinc-600 text-sm border-t border-zinc-800/50">
        <p>© 2025 Background Image Remover.</p>
      </footer>
    </div>
  );
}

export default App;
