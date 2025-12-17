import { useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from '../components/GlitchText';
import WireframeBackground from '../components/WireframeBackground';
import MissionLogs from '../components/MissionLogs';

export default function Hero() {
    const [line1Complete, setLine1Complete] = useState(false);
    const [line2Complete, setLine2Complete] = useState(false);

    return (
        <>
            <WireframeBackground />

            <div className="relative z-10 w-full h-full px-6 sm:px-12 md:px-16 lg:px-24 py-20 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full h-full items-center">
                    {/* Left column: Headlines + Subtext + Mission Logs */}
                    <div className="flex flex-col justify-center">
                        {/* Main headline */}
                        <motion.h1
                            className="font-headline font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] text-ir8-white leading-[0.9] tracking-[0.02em] mb-4 lg:mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <GlitchText
                                text="WE ARE THE THREAT"
                                delay={300}
                                onComplete={() => setLine1Complete(true)}
                            />
                            <br />
                            <span className="text-ir8-gray-mid">
                                <GlitchText
                                    text="YOU DIDN'T MODEL."
                                    delay={1000}
                                    onComplete={() => setLine2Complete(true)}
                                />
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.div
                            className="font-mono text-sm sm:text-base lg:text-lg text-ir8-gray-mid max-w-2xl mb-8 lg:mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: line2Complete ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-ir8-gray">&gt;</span>{' '}
                            Extreme adversarial simulation. Research-led attack vectors.
                            <br />
                            <span className="text-ir8-gray">&gt;</span>{' '}
                            Beyond the scope of standard penetration testing.
                        </motion.div>

                    </div>

                    {/* Right column: Mission Logs */}
                    <div className="flex items-start lg:items-center justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: line2Complete ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <MissionLogs
                                startDelay={line2Complete ? 300 : 10000}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Decorative version indicator */}
                <motion.div
                    className="absolute bottom-6 left-6 sm:left-12 md:left-16 lg:left-24 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: line1Complete ? 0.4 : 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="w-8 h-px bg-ir8-gray" />
                    <span className="font-mono text-[10px] text-ir8-gray">v2.0.1</span>
                </motion.div>
            </div>
        </>
    );
}
