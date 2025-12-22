import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, RoundedBox, Environment } from '@react-three/drei';
import { CargoBox } from './Scene3DHero';
import { Suspense, Component, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

class WebGLErrorBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}
const TrailerShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <group position={[0, -0.8, 0]}>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                <planeGeometry args={[4.2, 2.2]} />
                <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Side Walls (Transparent) */}
            <mesh position={[0, 1, -1.1]}>
                <boxGeometry args={[4.2, 2, 0.05]} />
                <meshStandardMaterial color="#94a3b8" transparent opacity={0.1} />
            </mesh>
            <mesh position={[0, 1, 1.1]}>
                <boxGeometry args={[4.2, 2, 0.05]} />
                <meshStandardMaterial color="#94a3b8" transparent opacity={0.1} />
            </mesh>

            {/* Front Wall */}
            <mesh position={[-2.1, 1, 0]}>
                <boxGeometry args={[0.05, 2, 2.2]} />
                <meshStandardMaterial color="#64748b" metalness={0.5} />
            </mesh>

            {/* Roof Frame */}
            <mesh position={[0, 2, -1.1]}>
                <boxGeometry args={[4.2, 0.05, 0.05]} />
                <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 2, 1.1]}>
                <boxGeometry args={[4.2, 0.05, 0.05]} />
                <meshStandardMaterial color="#475569" />
            </mesh>

            {children}
        </group>
    );
};

const InefficientLoad = () => {
    return (
        <TrailerShell>
            {/* Messy Boxes - Random positions, rotations, and gaps */}
            <group rotation={[0, 0.1, 0]} position={[-0.5, 0.3, -0.2]}>
                <CargoBox position={[0, 0, 0]} color="#ef4444" scale={0.9} />
            </group>
            <group rotation={[0, -0.2, 0.1]} position={[0.8, 0.3, 0.3]}>
                <CargoBox position={[0, 0, 0]} color="#dc2626" scale={0.9} />
            </group>
            <group rotation={[0.1, 0.3, 0]} position={[-1.2, 0.3, 0.5]}>
                <CargoBox position={[0, 0, 0]} color="#b91c1c" scale={0.9} />
            </group>
            <group rotation={[0, 0, 0]} position={[0.2, 0.3, -0.6]}>
                <CargoBox position={[0, 0, 0]} color="#ef4444" scale={0.9} />
            </group>
            <group rotation={[0, 0.2, 0]} position={[-0.4, 0.9, 0.2]}>
                <CargoBox position={[0, 0, 0]} color="#f87171" scale={0.9} />
            </group>
        </TrailerShell>
    );
};

const OptimizedLoad = () => {
    // Generate a grid of boxes
    const boxes = [];
    const colors = ["#10b981", "#059669", "#34d399"];

    for (let x = -1.5; x <= 1.5; x += 0.85) {
        for (let z = -0.6; z <= 0.6; z += 0.65) {
            for (let y = 0.3; y <= 1.5; y += 0.65) {
                boxes.push({ position: [x, y, z] as [number, number, number], color: colors[Math.floor(Math.random() * colors.length)] });
            }
        }
    }

    return (
        <TrailerShell>
            {boxes.map((box, i) => (
                <CargoBox key={i} position={box.position} color={box.color} scale={0.95} />
            ))}
        </TrailerShell>
    );
};

const FallbackView = ({ mode }: { mode: 'inefficient' | 'optimized' }) => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg">
        <div className="text-center p-4">
            <Package className={`w-12 h-12 mx-auto mb-2 ${mode === 'optimized' ? 'text-green-500' : 'text-red-500'}`} />
            <p className="text-sm text-muted-foreground">
                {mode === 'optimized' ? 'Optimized Loading' : 'Standard Loading'}
            </p>
        </div>
    </div>
);

export const ComparisonScene3D = ({ mode }: { mode: 'inefficient' | 'optimized' }) => {
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setWebglSupported(false);
            }
        } catch (e) {
            setWebglSupported(false);
        }
    }, []);

    if (!webglSupported) {
        return <FallbackView mode={mode} />;
    }

    return (
        <div className="w-full h-full">
            <WebGLErrorBoundary fallback={<FallbackView mode={mode} />}>
                <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[3, 2.5, 4.5]} fov={50} />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={mode === 'optimized' ? 1 : 0.5} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

                    <Suspense fallback={null}>
                        {mode === 'inefficient' ? <InefficientLoad /> : <OptimizedLoad />}
                    </Suspense>
                </Canvas>
            </WebGLErrorBoundary>
        </div>
    );
};
