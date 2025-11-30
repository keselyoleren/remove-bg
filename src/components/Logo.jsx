import React from 'react';

export function Logo({ className = "w-8 h-8" }) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#9333ea" />
                    <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
                <pattern id="logo-checker" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill="#27272a" />
                    <rect x="4" y="0" width="4" height="4" fill="#18181b" />
                    <rect x="0" y="4" width="4" height="4" fill="#18181b" />
                    <rect x="4" y="4" width="4" height="4" fill="#27272a" />
                </pattern>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#logo-checker)" />
            <path d="M0 8C0 3.58172 3.58172 0 8 0H32V32H0V8Z" fill="url(#logo-grad)" />
            <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white" fillOpacity="0.9" />
            <path d="M16 11L21 16L16 21L11 16L16 11Z" fill="url(#logo-grad)" />
        </svg>
    );
}
