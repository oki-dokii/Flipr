import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface StatusBarProps {
  position: [number, number, number];
  label: string;
  status: string;
  statusColor?: string;
  isWarning?: boolean;
}

const StatusBar = ({ position, label, status, statusColor = "#f5a623", isWarning = false }: StatusBarProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
    if (pulseRef.current && isWarning) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      pulseRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main bar background */}
      <RoundedBox args={[3.5, 0.5, 0.1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial 
          color="#0d1b2a" 
          metalness={0.4} 
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
      
      {/* Label */}
      <Text
        position={[-1.1, 0, 0.06]}
        fontSize={0.15}
        color="#8899aa"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Status badge */}
      <group position={[0.7, 0, 0.05]}>
        {isWarning && (
          <mesh ref={pulseRef} position={[0, 0, -0.02]}>
            <planeGeometry args={[1.6, 0.4]} />
            <meshBasicMaterial color={statusColor} transparent opacity={0.3} />
          </mesh>
        )}
        <RoundedBox args={[1.4, 0.32, 0.05]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color={statusColor} metalness={0.3} roughness={0.5} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {status}
        </Text>
      </group>
    </group>
  );
};

export default StatusBar;
