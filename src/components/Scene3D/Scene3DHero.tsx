import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Stars, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Cargo box component
export const CargoBox = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  return (
    <RoundedBox args={[0.8 * scale, 0.6 * scale, 0.6 * scale]} position={position} radius={0.05} smoothness={4}>
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
    </RoundedBox>
  );
};

// Main truck 3D model
const Truck3D = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Truck Trailer */}
      <group position={[-0.5, 0.8, 0]}>
        {/* Trailer body */}
        <RoundedBox args={[4, 2.2, 2]} position={[0, 0, 0]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#e8e8e8" metalness={0.3} roughness={0.4} />
        </RoundedBox>

        {/* Cargo boxes inside */}
        <CargoBox position={[-1.2, -0.5, 0.5]} color="#f5a623" scale={0.9} />
        <CargoBox position={[-1.2, -0.5, -0.4]} color="#e67e22" scale={0.9} />
        <CargoBox position={[-0.3, -0.5, 0.5]} color="#f5a623" scale={0.9} />
        <CargoBox position={[-0.3, -0.5, -0.4]} color="#d35400" scale={0.9} />
        <CargoBox position={[0.6, -0.5, 0.3]} color="#e67e22" scale={0.9} />
        <CargoBox position={[-1.2, 0.1, 0.5]} color="#d35400" scale={0.9} />
        <CargoBox position={[-0.3, 0.1, 0.5]} color="#f5a623" scale={0.9} />
        <CargoBox position={[-1.2, 0.1, -0.4]} color="#e67e22" scale={0.9} />
      </group>

      {/* Truck Cab */}
      <group position={[2.2, 0.6, 0]}>
        <RoundedBox args={[1.4, 1.8, 2]} position={[0, 0, 0]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#f0f0f0" metalness={0.4} roughness={0.3} />
        </RoundedBox>

        {/* Windshield */}
        <mesh position={[0.55, 0.3, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.1, 0.8, 1.6]} />
          <meshStandardMaterial color="#1a5276" metalness={0.8} roughness={0.1} transparent opacity={0.7} />
        </mesh>

        {/* Headlights */}
        <mesh position={[0.72, -0.1, 0.5]}>
          <boxGeometry args={[0.02, 0.2, 0.3]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.72, -0.1, -0.5]}>
          <boxGeometry args={[0.02, 0.2, 0.3]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Wheels */}
      {[[-1.5, -0.5, 1.1], [-1.5, -0.5, -1.1], [0.5, -0.5, 1.1], [0.5, -0.5, -1.1], [2.2, -0.5, 1.1], [2.2, -0.5, -1.1]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
            <meshStandardMaterial color="#222" metalness={0.3} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Platform / Loading dock */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[4, 4.2, 0.3, 32]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Platform glow ring */}
      <mesh position={[0, -0.94, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4, 64]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// Floating UI Panel
const FloatingPanel = ({
  position,
  title,
  value,
  subtitle,
  color = "#00bcd4",
  isWarning = false,
}: {
  position: [number, number, number];
  title: string;
  value?: string;
  subtitle?: string;
  color?: string;
  isWarning?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Html
        transform
        distanceFactor={8}
        style={{
          width: '200px',
        }}
      >
        <div
          className={`p-4 rounded-xl border backdrop-blur-md ${isWarning ? 'animate-pulse' : ''}`}
          style={{
            background: 'rgba(10, 22, 40, 0.85)',
            borderColor: color,
            boxShadow: `0 0 30px ${color}40`,
          }}
        >
          <div className="text-xs font-semibold mb-1" style={{ color }}>{title}</div>
          {value && <div className="text-2xl font-bold text-white">{value}</div>}
          {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
      </Html>
    </group>
  );
};

// Shelf unit
const ShelfUnit = ({ position }: { position: [number, number, number] }) => {
  const colors = ['#d35400', '#e67e22', '#f5a623', '#8b4513', '#cd853f'];

  return (
    <group position={position}>
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 0]}>
          <boxGeometry args={[0.08, 3, 0.08]} />
          <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {[0.3, 1.2, 2.1].map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[2, 0.05, 0.5]} />
            <meshStandardMaterial color="#34495e" metalness={0.5} roughness={0.5} />
          </mesh>
          <RoundedBox args={[0.4, 0.35, 0.35]} position={[-0.5, y + 0.2, 0]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color={colors[i % colors.length]} />
          </RoundedBox>
          <RoundedBox args={[0.4, 0.35, 0.35]} position={[0.3, y + 0.2, 0]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color={colors[(i + 1) % colors.length]} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
};

// Main scene content
const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00bcd4" />
      <pointLight position={[5, 3, 5]} intensity={0.5} color="#f5a623" />

      <Truck3D />

      {/* Floating panels */}
      <FloatingPanel
        position={[-5, 2.5, 1]}
        title="CAPACITY"
        value="95%"
        subtitle="Near Optimal"
        color="#f5a623"
      />

      <FloatingPanel
        position={[5.5, 3, 0]}
        title="⚠️ HOLD: OVERLOAD RISK"
        subtitle="↑ Split Shipments • ✓ Select Larger Truck"
        color="#e74c3c"
        isWarning
      />

      <FloatingPanel
        position={[-4.5, 0.5, 2]}
        title="TRUCKS USED"
        value="↓ 25%"
        subtitle="Fleet Efficiency"
        color="#00bcd4"
      />

      <FloatingPanel
        position={[5, 0, 2]}
        title="CO₂ SAVINGS"
        value="↓ 40%"
        subtitle="Carbon Reduction"
        color="#27ae60"
      />

      {/* Status bar under truck */}
      <Html position={[0, -0.2, 3]} transform distanceFactor={8}>
        <div
          className="px-6 py-2 rounded-full flex items-center gap-4"
          style={{
            background: 'rgba(13, 27, 42, 0.9)',
            border: '1px solid rgba(231, 76, 60, 0.5)',
          }}
        >
          <span className="text-gray-400 text-sm">LOAD STATUS:</span>
          <span
            className="px-4 py-1 rounded-full text-white text-sm font-bold animate-pulse"
            style={{ background: '#e74c3c' }}
          >
            OVERLOAD RISK!
          </span>
        </div>
      </Html>

      {/* Warehouse shelves */}
      <ShelfUnit position={[7, 0, -3]} />
      <ShelfUnit position={[7, 0, 0]} />
      <ShelfUnit position={[-7, 0, -2]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a1628" metalness={0.2} roughness={0.8} />
      </mesh>

      <gridHelper args={[30, 30, '#1a3a5c', '#0d2137']} position={[0, -1.69, 0]} />

      <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

const Scene3DHero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const navigate = useNavigate();

  return (
    <div className="w-full h-[75vh] relative bg-background">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[10, 6, 12]} fov={45} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minDistance={8}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.4}
        />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* Title overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none w-full px-4">
        <motion.div style={{ opacity }}>
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-2 text-foreground tracking-wide"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            {Array.from("SMART TRUCK LOADING").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gradient mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 1.5,
                  staggerChildren: 0.08
                }
              }
            }}
          >
            {Array.from("OPTIMIZATION SYSTEM").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="text-lg text-muted-foreground"
          >
            Optimize Loads, Maximize Safety
          </motion.p>
        </motion.div>
      </div>

      {/* CTA buttons */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-10 items-center justify-center w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.5 }}
        >
          <Button
            size="xl"
            onClick={() => navigate('/register')}
            className="rounded-full bg-gradient-to-r from-cyan to-teal text-primary-foreground font-semibold text-lg hover:scale-110 hover:shadow-cyan/50 shadow-lg transition-all duration-300 pointer-events-auto"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div >
  );
};

export default Scene3DHero;
