import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Artifact {
    id: number;
    type: 'tear' | 'noise' | 'rgb';
    y: number;
    height: number;
    offsetX: number;
    duration: number;
}

let artifactId = 0;

export default function GlitchArtifacts() {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);

    const createArtifact = useCallback(() => {
        const types: Array<'tear' | 'noise' | 'rgb'> = ['tear', 'noise', 'rgb'];
        const type = types[Math.floor(Math.random() * types.length)];

        const artifact: Artifact = {
            id: artifactId++,
            type,
            y: Math.random() * 100,
            height: 2 + Math.random() * 8,
            offsetX: (Math.random() - 0.5) * 20,
            duration: 100 + Math.random() * 200,
        };

        setArtifacts(prev => [...prev, artifact]);

        // Remove artifact after duration
        setTimeout(() => {
            setArtifacts(prev => prev.filter(a => a.id !== artifact.id));
        }, artifact.duration);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // 5% chance each tick to create an artifact
            if (Math.random() > 0.95) {
                createArtifact();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [createArtifact]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9995 }}>
            <AnimatePresence>
                {artifacts.map(artifact => (
                    <GlitchBar key={artifact.id} artifact={artifact} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function GlitchBar({ artifact }: { artifact: Artifact }) {
    const { type, y, height, offsetX, duration } = artifact;

    if (type === 'tear') {
        // Horizontal tear/displacement
        return (
            <motion.div
                className="absolute left-0 w-full bg-ir8-white/5"
                style={{
                    top: `${y}%`,
                    height: `${height}px`,
                    transform: `translateX(${offsetX}px)`,
                    backdropFilter: 'invert(0.1)',
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration / 1000 }}
            />
        );
    }

    if (type === 'noise') {
        // Noise burst
        return (
            <motion.div
                className="absolute bg-ir8-white/10"
                style={{
                    top: `${y}%`,
                    left: `${20 + Math.random() * 60}%`,
                    width: `${50 + Math.random() * 200}px`,
                    height: `${height * 2}px`,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration / 2000 }}
            />
        );
    }

    if (type === 'rgb') {
        // RGB channel separation
        return (
            <motion.div
                className="absolute left-0 w-full"
                style={{
                    top: `${y}%`,
                    height: `${height * 3}px`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration / 1000 }}
            >
                {/* Red channel */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        transform: `translateX(${-offsetX}px)`,
                        mixBlendMode: 'screen',
                    }}
                />
                {/* Cyan channel */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'rgba(0, 255, 255, 0.1)',
                        transform: `translateX(${offsetX}px)`,
                        mixBlendMode: 'screen',
                    }}
                />
            </motion.div>
        );
    }

    return null;
}
