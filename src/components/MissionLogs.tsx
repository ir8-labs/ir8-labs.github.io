import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DecodeText from './DecodeText';

interface MissionLog {
    permissions: string;
    operation: string;
    target: string;
    status: string;
}

const logs: MissionLog[] = [
    {
        permissions: 'drwx-----',
        operation: 'OP_SILENT_CITADEL',
        target: 'Critical Infrastructure',
        status: '[REDACTED]',
    },
    {
        permissions: 'drwx-----',
        operation: 'OP_GLASS_CEILING',
        target: 'Fortune 100 Finance',
        status: '[REDACTED]',
    },
];

interface MissionLogsProps {
    startDelay?: number;
    className?: string;
}

export default function MissionLogs({ startDelay = 0, className = '' }: MissionLogsProps) {
    const [showHeader, setShowHeader] = useState(false);
    const [headerComplete, setHeaderComplete] = useState(false);
    const [visibleLogs, setVisibleLogs] = useState<number[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeader(true);
        }, startDelay);

        return () => clearTimeout(timer);
    }, [startDelay]);

    useEffect(() => {
        if (!headerComplete) return;

        // Reveal logs one by one after header completes
        logs.forEach((_, index) => {
            setTimeout(() => {
                setVisibleLogs(prev => [...prev, index]);
            }, index * 400);
        });
    }, [headerComplete]);

    return (
        <div className={`font-mono text-sm sm:text-base lg:text-lg ${className}`}>
            {/* Header */}
            {showHeader && (
                <motion.div
                    className="text-ir8-gray-mid mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <DecodeText
                        text="MISSION_LOGS"
                        speed={30}
                        onComplete={() => setHeaderComplete(true)}
                    />
                </motion.div>
            )}

            {/* Log entries */}
            <div className="space-y-1">
                {logs.map((log, index) => (
                    <motion.div
                        key={log.operation}
                        className="flex flex-wrap gap-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                            opacity: visibleLogs.includes(index) ? 1 : 0,
                            x: visibleLogs.includes(index) ? 0 : -10,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {visibleLogs.includes(index) && (
                            <>
                                <span className="text-ir8-gray">{log.permissions}</span>
                                <DecodeText
                                    text={log.operation}
                                    className="text-ir8-white"
                                    speed={25}
                                />
                                <span className="text-ir8-gray-mid">({log.target})</span>
                                <span className="text-ir8-white">{log.status}</span>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
