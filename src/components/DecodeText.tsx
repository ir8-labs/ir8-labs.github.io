import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DecodeTextProps {
    text: string;
    className?: string;
    delay?: number;
    speed?: number;
    onComplete?: () => void;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\|{}[]';

export default function DecodeText({
    text,
    className = '',
    delay = 0,
    speed = 50,
    onComplete
}: DecodeTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [isDecoding, setIsDecoding] = useState(false);

    const getRandomChar = useCallback(() => {
        return CHARS[Math.floor(Math.random() * CHARS.length)];
    }, []);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        let interval: ReturnType<typeof setInterval>;

        timeout = setTimeout(() => {
            setIsDecoding(true);
            let currentIndex = 0;
            let iterations = 0;
            const maxIterationsPerChar = 3;

            // Initialize with random characters
            setDisplayText(text.split('').map(char =>
                char === ' ' || char === '\n' ? char : getRandomChar()
            ).join(''));

            interval = setInterval(() => {
                setDisplayText(prev => {
                    const chars = prev.split('');
                    const targetChars = text.split('');

                    // Update characters up to current index + some look-ahead scramble
                    for (let i = 0; i < chars.length; i++) {
                        if (targetChars[i] === ' ' || targetChars[i] === '\n') {
                            chars[i] = targetChars[i];
                        } else if (i < currentIndex) {
                            chars[i] = targetChars[i];
                        } else if (i < currentIndex + 5) {
                            // Scramble zone
                            chars[i] = getRandomChar();
                        }
                    }

                    return chars.join('');
                });

                iterations++;

                if (iterations >= maxIterationsPerChar) {
                    iterations = 0;
                    currentIndex++;

                    if (currentIndex >= text.length) {
                        clearInterval(interval);
                        setDisplayText(text);
                        setIsDecoding(false);
                        onComplete?.();
                    }
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay, speed, getRandomChar, onComplete]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: delay / 1000 }}
        >
            {displayText || text.split('').map(char =>
                char === ' ' || char === '\n' ? char : '_'
            ).join('')}
            {isDecoding && (
                <span className="inline-block w-2 h-5 bg-ir8-white ml-1 animate-pulse" />
            )}
        </motion.span>
    );
}
