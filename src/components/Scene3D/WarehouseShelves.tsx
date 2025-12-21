import { RoundedBox } from '@react-three/drei';

const BoxOnShelf = ({ position, color }: { position: [number, number, number]; color: string }) => (
  <RoundedBox args={[0.4, 0.35, 0.35]} position={position} radius={0.02} smoothness={2}>
    <meshStandardMaterial color={color} metalness={0.1} roughness={0.7} />
  </RoundedBox>
);

const ShelfUnit = ({ position }: { position: [number, number, number] }) => {
  const shelfColors = ['#d35400', '#e67e22', '#f5a623', '#8b4513', '#cd853f'];
  
  return (
    <group position={position}>
      {/* Vertical supports */}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 0]}>
          <boxGeometry args={[0.08, 3, 0.08]} />
          <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      
      {/* Shelves */}
      {[0.3, 1.2, 2.1, 3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[2, 0.05, 0.5]} />
          <meshStandardMaterial color="#34495e" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      
      {/* Boxes on shelves */}
      <BoxOnShelf position={[-0.5, 0.5, 0]} color={shelfColors[0]} />
      <BoxOnShelf position={[0, 0.5, 0]} color={shelfColors[1]} />
      <BoxOnShelf position={[0.5, 0.5, 0]} color={shelfColors[2]} />
      
      <BoxOnShelf position={[-0.4, 1.4, 0]} color={shelfColors[3]} />
      <BoxOnShelf position={[0.2, 1.4, 0]} color={shelfColors[4]} />
      <BoxOnShelf position={[0.6, 1.4, 0]} color={shelfColors[0]} />
      
      <BoxOnShelf position={[-0.5, 2.3, 0]} color={shelfColors[1]} />
      <BoxOnShelf position={[0.3, 2.3, 0]} color={shelfColors[2]} />
    </group>
  );
};

const WarehouseShelves = () => {
  return (
    <group>
      <ShelfUnit position={[6, 0, -3]} />
      <ShelfUnit position={[6, 0, 0]} />
      <ShelfUnit position={[6, 0, 3]} />
      <ShelfUnit position={[-6, 0, -3]} />
      <ShelfUnit position={[-6, 0, 0]} />
    </group>
  );
};

export default WarehouseShelves;
