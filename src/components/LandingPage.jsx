import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sparkles, Upload, Zap, Download, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error("Failed to login", error);
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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

            {/* Header */}
            <header className="p-6 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            BackgroundRemover
                        </h1>
                    </div>
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl w-full text-center space-y-12"
                >
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                            Remove Backgrounds <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Like Magic
                            </span>
                        </h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Professional quality background removal in seconds. Free, fast, and secure.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button
                            onClick={handleLogin}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1"
                        >
                            <span>Get Started for Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* How it works */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        {[
                            { icon: Upload, title: "Upload Image", desc: "Drag & drop any image (JPG, PNG, HEIC)" },
                            { icon: Zap, title: "Auto Process", desc: "AI automatically removes the background" },
                            { icon: Download, title: "Download", desc: "Get your transparent PNG instantly" }
                        ].map((step, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-zinc-800 flex items-center justify-center text-blue-400">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-zinc-400">{step.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-zinc-600 text-sm border-t border-zinc-900">
                <p>© 2025 Background Image Remover. All rights reserved.</p>
            </footer>
        </div>
    );
}
