import { useEffect, useRef, useCallback } from 'react';

interface Node {
    x: number;
    y: number;
    z: number;
    baseX: number;
    baseY: number;
    baseZ: number;
}

interface Pulse {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    strength: number;
}

// Simple 2D noise function for terrain generation
function noise2D(x: number, y: number, seed: number = 0): number {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
}

// Smoothed noise with interpolation
function smoothNoise(x: number, y: number, scale: number, seed: number = 0): number {
    const scaledX = x * scale;
    const scaledY = y * scale;

    const x0 = Math.floor(scaledX);
    const y0 = Math.floor(scaledY);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const sx = scaledX - x0;
    const sy = scaledY - y0;

    const n00 = noise2D(x0, y0, seed);
    const n10 = noise2D(x1, y0, seed);
    const n01 = noise2D(x0, y1, seed);
    const n11 = noise2D(x1, y1, seed);

    const nx0 = n00 * (1 - sx) + n10 * sx;
    const nx1 = n01 * (1 - sx) + n11 * sx;

    return nx0 * (1 - sy) + nx1 * sy;
}

// Multi-octave fractal noise for terrain
function terrainNoise(x: number, y: number, time: number): number {
    let value = 0;
    value += smoothNoise(x, y, 0.003, time * 0.1) * 1.0;
    value += smoothNoise(x, y, 0.007, time * 0.15) * 0.5;
    value += smoothNoise(x, y, 0.015, time * 0.2) * 0.25;
    return value / 1.75;
}

export default function WireframeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const nodesRef = useRef<Node[]>([]);
    const pulsesRef = useRef<Pulse[]>([]);
    const timeRef = useRef(0);
    const lastPulseRef = useRef(0);

    const initNodes = useCallback((width: number, height: number) => {
        const nodes: Node[] = [];
        const baseSpacing = 35;

        // Create non-uniform grid - denser on right side
        for (let y = -baseSpacing; y < height + baseSpacing; y += baseSpacing) {
            for (let x = -baseSpacing; x < width + baseSpacing; x += baseSpacing) {
                // Density modifier - more nodes on right 60% of screen
                const normalizedX = x / width;
                const densityMultiplier = normalizedX > 0.4 ? 1 : 0.5;

                // Skip some nodes on the left side for variation
                if (normalizedX < 0.4 && Math.random() > densityMultiplier) {
                    continue;
                }

                // Add some positional jitter for organic feel
                const jitterX = (Math.random() - 0.5) * 10;
                const jitterY = (Math.random() - 0.5) * 10;

                // Base elevation from noise
                const baseZ = terrainNoise(x, y, 0) * 50;

                nodes.push({
                    x: x + jitterX,
                    y: y + jitterY,
                    z: baseZ,
                    baseX: x + jitterX,
                    baseY: y + jitterY,
                    baseZ: baseZ,
                });
            }
        }

        nodesRef.current = nodes;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const nodes = nodesRef.current;
        const pulses = pulsesRef.current;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Update time for animation
        timeRef.current += 0.008;
        const time = timeRef.current;

        // Occasionally spawn a pulse
        if (time - lastPulseRef.current > 3 && Math.random() > 0.995) {
            const pulseX = width * 0.4 + Math.random() * width * 0.5;
            const pulseY = Math.random() * height;
            pulses.push({
                x: pulseX,
                y: pulseY,
                radius: 0,
                maxRadius: 300 + Math.random() * 200,
                strength: 15 + Math.random() * 10,
            });
            lastPulseRef.current = time;
        }

        // Update pulses
        for (let i = pulses.length - 1; i >= 0; i--) {
            pulses[i].radius += 3;
            if (pulses[i].radius > pulses[i].maxRadius) {
                pulses.splice(i, 1);
            }
        }

        // Update node positions with active terrain animation
        for (const node of nodes) {
            // Multiple wave frequencies for complex organic movement
            const wave1 = Math.sin(node.baseX * 0.008 + time * 1.2) * 8;
            const wave2 = Math.cos(node.baseY * 0.006 + time * 0.9) * 6;
            const wave3 = Math.sin((node.baseX + node.baseY) * 0.004 + time * 1.5) * 5;

            // Terrain reformation - elevation changes over time
            const dynamicTerrain = terrainNoise(node.baseX, node.baseY, time) * 30;

            // Pulse effects
            let pulseOffset = 0;
            for (const pulse of pulses) {
                const dx = node.baseX - pulse.x;
                const dy = node.baseY - pulse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const pulseWidth = 50;

                if (Math.abs(dist - pulse.radius) < pulseWidth) {
                    const pulseStrength = 1 - Math.abs(dist - pulse.radius) / pulseWidth;
                    pulseOffset += Math.sin(pulseStrength * Math.PI) * pulse.strength;
                }
            }

            node.x = node.baseX + wave1 + wave3 * 0.5;
            node.y = node.baseY + wave2 + wave3 * 0.3;
            node.z = node.baseZ + dynamicTerrain + pulseOffset;
        }

        // Draw connections between nearby nodes
        ctx.lineWidth = 1;

        // Sort nodes by z for proper depth rendering
        const sortedNodes = [...nodes].sort((a, b) => a.z - b.z);

        for (let i = 0; i < sortedNodes.length; i++) {
            const node = sortedNodes[i];
            const normalizedX = node.x / width;

            // Skip rendering if too far left (sparse area)
            if (normalizedX < 0.15 && Math.random() > 0.3) continue;

            for (let j = i + 1; j < sortedNodes.length; j++) {
                const other = sortedNodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dz = Math.abs(node.z - other.z);
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Connect nodes within range and similar elevation (contour lines)
                const maxDist = 60 + (normalizedX * 20); // Closer connections on right

                if (distance < maxDist && distance > 5) {
                    // Elevation-based connection - prefer similar heights
                    const elevationFactor = Math.max(0, 1 - dz / 20);

                    // Distance-based opacity
                    const distanceOpacity = 1 - (distance / maxDist);

                    // Depth-based opacity - brighter at higher elevation
                    const depthFactor = 0.3 + (node.z / 80) * 0.7;

                    // Position-based opacity - brighter on right
                    const positionFactor = 0.4 + normalizedX * 0.6;

                    const opacity = distanceOpacity * elevationFactor * depthFactor * positionFactor * 0.6;

                    if (opacity > 0.02) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw nodes as small dots
        for (const node of nodes) {
            const normalizedX = node.x / width;

            // Skip some nodes on left side
            if (normalizedX < 0.2 && Math.random() > 0.4) continue;

            // Depth and position based opacity
            const depthFactor = 0.2 + (node.z / 80) * 0.8;
            const positionFactor = 0.3 + normalizedX * 0.7;
            const opacity = depthFactor * positionFactor * 0.5;

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1 + (node.z / 80), 0, Math.PI * 2);
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initNodes(canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [draw, initNodes]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
