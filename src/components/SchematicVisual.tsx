import { useEffect, useRef, useCallback } from 'react';

interface SchematicNode {
    x: number;
    y: number;
    type: 'register' | 'gate' | 'junction' | 'endpoint';
    label?: string;
    compromised?: boolean;
    pulsePhase: number;
}

interface Connection {
    from: number;
    to: number;
    dataFlow: number;
    flowSpeed: number;
}

export default function SchematicVisual() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const timeRef = useRef(0);
    const scanLineRef = useRef(0);
    const nodesRef = useRef<SchematicNode[]>([]);
    const connectionsRef = useRef<Connection[]>([]);

    const initSchematic = useCallback((width: number, height: number) => {
        const nodes: SchematicNode[] = [];
        const connections: Connection[] = [];

        // Grid layout for SCADA-style schematic
        const gridCols = 5;
        const gridRows = 4;
        const cellWidth = width / (gridCols + 1);
        const cellHeight = height / (gridRows + 1);

        // Create nodes in a semi-structured layout
        const nodeTypes: Array<'register' | 'gate' | 'junction' | 'endpoint'> =
            ['register', 'gate', 'junction', 'endpoint'];

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                // Add some randomness to skip nodes for organic feel
                if (Math.random() > 0.7) continue;

                const x = cellWidth * (col + 1) + (Math.random() - 0.5) * 20;
                const y = cellHeight * (row + 1) + (Math.random() - 0.5) * 20;
                const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];

                nodes.push({
                    x,
                    y,
                    type,
                    label: type === 'register' ? `R${nodes.length}` :
                           type === 'endpoint' ? `EP${nodes.length}` : undefined,
                    compromised: Math.random() > 0.7,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        }

        // Create connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < cellWidth * 1.8 && Math.random() > 0.4) {
                    connections.push({
                        from: i,
                        to: j,
                        dataFlow: 0,
                        flowSpeed: 0.5 + Math.random() * 1.5,
                    });
                }
            }
        }

        nodesRef.current = nodes;
        connectionsRef.current = connections;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const nodes = nodesRef.current;
        const connections = connectionsRef.current;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Update time
        timeRef.current += 0.016;
        const time = timeRef.current;

        // Update scan line
        scanLineRef.current = (scanLineRef.current + 0.5) % height;

        // Draw grid underlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 20;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw connections (buses/wires)
        for (const conn of connections) {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];

            // Update data flow animation
            conn.dataFlow = (conn.dataFlow + conn.flowSpeed * 0.02) % 1;

            // Draw wire with orthogonal routing (SCADA style)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();

            // Use L-shaped routing
            const midX = (fromNode.x + toNode.x) / 2;
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(midX, fromNode.y);
            ctx.lineTo(midX, toNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();

            // Draw data flow packets
            const flowPos = conn.dataFlow;
            let packetX: number, packetY: number;

            if (flowPos < 0.33) {
                const t = flowPos / 0.33;
                packetX = fromNode.x + (midX - fromNode.x) * t;
                packetY = fromNode.y;
            } else if (flowPos < 0.66) {
                const t = (flowPos - 0.33) / 0.33;
                packetX = midX;
                packetY = fromNode.y + (toNode.y - fromNode.y) * t;
            } else {
                const t = (flowPos - 0.66) / 0.34;
                packetX = midX + (toNode.x - midX) * t;
                packetY = toNode.y;
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw nodes
        for (const node of nodes) {
            const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5;

            // Node appearance based on type
            ctx.strokeStyle = node.compromised
                ? `rgba(255, 255, 255, ${0.6 + pulse * 0.4})`
                : 'rgba(255, 255, 255, 0.3)';
            ctx.fillStyle = node.compromised
                ? `rgba(255, 255, 255, ${0.05 + pulse * 0.1})`
                : 'rgba(0, 0, 0, 1)';
            ctx.lineWidth = node.compromised ? 2 : 1;

            switch (node.type) {
                case 'register':
                    // Rectangle for registers
                    ctx.beginPath();
                    ctx.rect(node.x - 15, node.y - 10, 30, 20);
                    ctx.fill();
                    ctx.stroke();
                    break;

                case 'gate':
                    // Triangle/wedge for gates
                    ctx.beginPath();
                    ctx.moveTo(node.x - 12, node.y - 10);
                    ctx.lineTo(node.x + 12, node.y);
                    ctx.lineTo(node.x - 12, node.y + 10);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;

                case 'junction':
                    // Diamond for junctions
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y - 10);
                    ctx.lineTo(node.x + 10, node.y);
                    ctx.lineTo(node.x, node.y + 10);
                    ctx.lineTo(node.x - 10, node.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;

                case 'endpoint':
                    // Circle for endpoints
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    break;
            }

            // Draw label if exists
            if (node.label) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.font = '8px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + 22);
            }

            // Compromised indicator
            if (node.compromised) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.3})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 20 + pulse * 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw scan line effect
        const scanY = scanLineRef.current;
        const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 30, width, 60);

        animationRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (!container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            initSchematic(canvas.width, canvas.height);
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
    }, [draw, initSchematic]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
        />
    );
}
