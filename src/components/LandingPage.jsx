import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Zap, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
    const { login } = useAuth();

    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = async () => {
        // Prevent multiple clicks while login is processing
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            await login();
        } catch (error) {
            console.error("Login attempt failed:", error);

            // CASE 1: The user manually closed the popup
            if (error.code === 'auth/popup-closed-by-user') {
                console.log("User closed the popup. Login cancelled.");
                // Do not set an error message here, just stop loading
                setIsLoading(false);
                return;
            }

            // CASE 2: The browser blocked the popup (AdBlock or settings)
            if (error.code === 'auth/popup-blocked') {
                try {
                    console.log("Popup blocked, attempting redirect login...");
                    await login();
                    // Note: redirect will reload page, so no need to set isLoading false usually
                } catch (redirectError) {
                    console.error("Redirect login failed", redirectError);
                    setError("Login failed. Please check your popup blocker settings.");
                    setIsLoading(false);
                }
                return;
            }

            // CASE 3: Generic error
            setError("Failed to login. Please try again.");
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="px-6 py-6 sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Logo className="w-10 h-10" />
                        <span className="text-lg font-bold tracking-tight">Remove Background</span>
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="px-5 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : 'Log in'}
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl w-full text-center space-y-16 py-20"
                >
                    {error && (
                        <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 max-w-sm mx-auto flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <motion.div variants={itemVariants} className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Batch Processing Ready
                        </div>

                        <h1 className="text-6xl md:text-6xl font-bold tracking-tight text-white leading-[0.95]">
                            Remove backgrounds. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                Just like magic.
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
                            The simplest way to remove image backgrounds. <br />
                            <span className="text-white font-medium">Free, fast, and privacy-focused.</span>
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 rounded-full text-lg font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Start Removing</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                        {[
                            { icon: Upload, title: "Upload", desc: "Drag & drop any image" },
                            { icon: Zap, title: "Process", desc: "Instant AI removal" },
                            { icon: Download, title: "Download", desc: "Save as transparent PNG" }
                        ].map((step, index) => (
                            <div key={index} className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
                                <div className="p-4 rounded-2xl bg-white/10 text-white">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                                <p className="text-zinc-400 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-zinc-600 text-sm">
                <p>© 2025 Remove Background by <a href="https://github.com/keselyoleren" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">keselyoleren</a></p>
            </footer>
        </div>
    );
}