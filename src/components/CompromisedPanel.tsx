import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SchematicVisual from './SchematicVisual';
import DecodeText from './DecodeText';

interface CompromisedPanelProps {
    className?: string;
    startDelay?: number;
}

export default function CompromisedPanel({ className = '', startDelay = 0 }: CompromisedPanelProps) {
    const [visible, setVisible] = useState(false);
    const [headerComplete, setHeaderComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, startDelay);

        return () => clearTimeout(timer);
    }, [startDelay]);

    if (!visible) return null;

    return (
        <motion.div
            className={`border border-ir8-white/30 bg-ir8-black/50 backdrop-blur-sm ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Header */}
            <div className="border-b border-ir8-white/20 px-4 py-3">
                <div className="font-mono text-xl sm:text-2xl lg:text-3xl text-ir8-white tracking-wider">
                    <DecodeText
                        text="COMPROMISED"
                        speed={40}
                        onComplete={() => setHeaderComplete(true)}
                    />
                </div>
            </div>

            {/* Schematic area */}
            <div className="relative aspect-square w-full min-h-[200px] max-h-[300px]">
                {headerComplete && <SchematicVisual />}
            </div>

            {/* Data readouts */}
            <motion.div
                className="border-t border-ir8-white/20 px-4 py-3 font-mono text-xs sm:text-sm lg:text-base space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: headerComplete ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="flex justify-between">
                    <span className="text-ir8-gray-mid">SYS_ID:</span>
                    <span className="text-ir8-white">0x7F3A9C2E</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-ir8-gray-mid">VECTOR:</span>
                    <span className="text-ir8-white">LATERAL_MOVEMENT</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-ir8-gray-mid">STATUS:</span>
                    <span className="text-ir8-white">DOMAIN_DOMINANCE</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
