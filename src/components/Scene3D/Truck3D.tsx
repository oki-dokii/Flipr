import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CargoBox = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  return (
    <RoundedBox args={[0.8 * scale, 0.6 * scale, 0.6 * scale]} position={position} radius={0.05} smoothness={4}>
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
    </RoundedBox>
  );
};

const Truck3D = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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
        
        {/* Trailer frame lines */}
        <mesh position={[0, -0.9, 1.01]}>
          <boxGeometry args={[3.8, 0.1, 0.02]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.9, -1.01]}>
          <boxGeometry args={[3.8, 0.1, 0.02]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>
        
        {/* Cargo boxes inside (visible through open back) */}
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
        {/* Main cab body */}
        <RoundedBox args={[1.4, 1.8, 2]} position={[0, 0, 0]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#f0f0f0" metalness={0.4} roughness={0.3} />
        </RoundedBox>
        
        {/* Windshield */}
        <mesh position={[0.55, 0.3, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.1, 0.8, 1.6]} />
          <meshStandardMaterial color="#1a5276" metalness={0.8} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        
        {/* Front grille */}
        <mesh position={[0.71, -0.3, 0]}>
          <boxGeometry args={[0.02, 0.6, 1.4]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
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
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.32, 8]} />
            <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
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

export default Truck3D;
