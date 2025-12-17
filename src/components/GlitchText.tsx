import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
    delay?: number;
    onComplete?: () => void;
}

export default function GlitchText({
    text,
    className = '',
    delay = 0,
    onComplete
}: GlitchTextProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setIsGlitching(true);
            setIsVisible(true);

            // Glitch for a short duration then settle
            const glitchTimeout = setTimeout(() => {
                setIsGlitching(false);
                onComplete?.();
            }, 600);

            return () => clearTimeout(glitchTimeout);
        }, delay);

        return () => clearTimeout(showTimeout);
    }, [delay, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.span
                    className={`relative inline-block ${className}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.05 }}
                >
                    {/* Main text */}
                    <span className="relative z-10">{text}</span>

                    {/* Glitch layers */}
                    {isGlitching && (
                        <>
                            {/* Red channel offset */}
                            <motion.span
                                className="absolute inset-0 text-red-500 opacity-70"
                                style={{ mixBlendMode: 'screen' }}
                                animate={{
                                    x: [0, -3, 2, -1, 3, 0],
                                    y: [0, 1, -1, 2, -1, 0],
                                }}
                                transition={{
                                    duration: 0.15,
                                    repeat: 4,
                                    ease: 'linear',
                                }}
                            >
                                {text}
                            </motion.span>

                            {/* Cyan channel offset */}
                            <motion.span
                                className="absolute inset-0 text-cyan-500 opacity-70"
                                style={{ mixBlendMode: 'screen' }}
                                animate={{
                                    x: [0, 3, -2, 1, -3, 0],
                                    y: [0, -1, 1, -2, 1, 0],
                                }}
                                transition={{
                                    duration: 0.15,
                                    repeat: 4,
                                    ease: 'linear',
                                }}
                            >
                                {text}
                            </motion.span>

                            {/* Slice effect */}
                            <motion.span
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    clipPath: 'polygon(0 40%, 100% 40%, 100% 60%, 0 60%)',
                                }}
                                animate={{
                                    x: [-5, 5, -3, 4, 0],
                                }}
                                transition={{
                                    duration: 0.1,
                                    repeat: 6,
                                    ease: 'linear',
                                }}
                            >
                                {text}
                            </motion.span>
                        </>
                    )}
                </motion.span>
            )}
        </AnimatePresence>
    );
}
