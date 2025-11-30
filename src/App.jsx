import React, { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import heic2any from 'heic2any';
import { ImageUploader } from './components/ImageUploader';
import { ImageList } from './components/ImageList';
import { LandingPage } from './components/LandingPage';
import { Trash2, Download, LogOut, Loader2 } from 'lucide-react';
import { Logo } from './components/Logo';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './contexts/AuthContext';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-zinc-400 mb-6">
              The application encountered an unexpected error.
            </p>
            <pre className="bg-black/50 p-4 rounded-lg text-left text-xs text-red-300 overflow-auto max-h-40 mb-6">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}

function AppContent() {
  const { currentUser, logout, loading } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="px-6 py-6 sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="w-10 h-10" />
            <span className="text-lg font-bold tracking-tight">Remove Background</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 hidden md:inline-block font-medium">
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 relative overflow-y-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center gap-10 z-10 pb-20 pt-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Upload Images
            </h2>
            <p className="text-zinc-400 text-lg font-medium">
              We'll remove the background automatically.
            </p>
          </div>

          <ImageUploader onImageSelect={handleImageSelect} isProcessing={isProcessing} />

          {images.length > 0 && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-2 border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Processed Images
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 text-sm font-bold">
                    {images.length}
                  </span>
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                  <button
                    onClick={handleDownloadAll}
                    disabled={!images.some(img => img.status === 'completed')}
                    className="flex items-center gap-2 px-5 py-2 text-sm bg-white text-zinc-950 font-semibold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5"
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
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-white/5">
        <p>© 2025 Remove Background by <a href="https://github.com/keselyoleren" target="_blank" rel="noopener noreferrer">keselyoleren</a></p>
      </footer>
    </div>
  );
}

export default App;
