import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingPanelProps {
  position: [number, number, number];
  title: string;
  value?: string;
  subtitle?: string;
  color?: string;
  width?: number;
  height?: number;
  floatOffset?: number;
  floatSpeed?: number;
}

const FloatingPanel = ({ 
  position, 
  title, 
  value, 
  subtitle, 
  color = "#00bcd4",
  width = 2,
  height = 1.2,
  floatOffset = 0,
  floatSpeed = 0.8
}: FloatingPanelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed + floatOffset) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glow behind */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.3, height + 0.3]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      
      {/* Glass panel */}
      <RoundedBox args={[width, height, 0.08]} radius={0.05} smoothness={4}>
        <meshStandardMaterial 
          color="#0a1628" 
          metalness={0.5} 
          roughness={0.2} 
          transparent 
          opacity={0.85}
        />
      </RoundedBox>
      
      {/* Border glow */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[width - 0.05, height - 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, height * 0.3, 0.06]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {title}
      </Text>
      
      {/* Value */}
      {value && (
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {value}
        </Text>
      )}
      
      {/* Subtitle */}
      {subtitle && (
        <Text
          position={[0, -height * 0.3, 0.06]}
          fontSize={0.12}
          color="#8899aa"
          anchorX="center"
          anchorY="middle"
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
};

export default FloatingPanel;
