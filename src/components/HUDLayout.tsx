import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlitchArtifacts from './GlitchArtifacts';

interface HUDLayoutProps {
    children: React.ReactNode;
}

export default function HUDLayout({ children }: HUDLayoutProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="relative w-full h-full bg-ir8-black overflow-hidden">
            {/* Vignette */}
            <div className="vignette" />

            {/* Scanlines */}
            <div className="scanlines" />

            {/* Noise overlay */}
            <div className="noise-overlay" />

            {/* Random glitch artifacts */}
            <GlitchArtifacts />

            {/* Top-Left: Logo with status indicator */}
            <motion.div
                className="hud-corner hud-top-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Link to="/" className="group flex items-center gap-3">
                    <img
                        src="/img/ir8-new-logo.svg"
                        alt="IR8"
                        className="h-16 md:h-20 lg:h-24 w-auto"
                    />
                    <span className="font-mono text-xs md:text-sm lg:text-base text-ir8-gray-mid">
                        [STATUS: <span className="text-ir8-white">ACTIVE</span>]
                    </span>
                </Link>
            </motion.div>

            {/* Top-Right: /PROTOCOL */}
            <motion.div
                className="hud-corner hud-top-right hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Link
                    to="/protocol"
                    className={`text-ir8-white ${isActive('/protocol') ? '!opacity-100' : ''}`}
                >
                    /PROTOCOL
                </Link>
            </motion.div>

            {/* Bottom-Left: /OPERATIONS */}
            <motion.div
                className="hud-corner hud-bottom-left hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Link
                    to="/operations"
                    className={`text-ir8-white ${isActive('/operations') ? '!opacity-100' : ''}`}
                >
                    /OPERATIONS
                </Link>
            </motion.div>

            {/* Bottom-Right: /INITIALIZE */}
            <motion.div
                className="hud-corner hud-bottom-right hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Link
                    to="/initialize"
                    className={`text-ir8-white ${isActive('/initialize') ? '!opacity-100' : ''}`}
                >
                    /INITIALIZE
                </Link>
            </motion.div>

            {/* Main content area */}
            <main className="relative z-10 w-full h-full flex items-center justify-center">
                {children}
            </main>
        </div>
    );
}
