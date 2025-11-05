import { Text } from "@react-three/drei";
import type { User } from "../lib/stores/useBPMN";

interface UserPresenceProps {
  user: User;
}

export function UserPresence({ user }: UserPresenceProps) {
  return (
    <group position={user.position}>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={user.color} emissive={user.color} emissiveIntensity={0.5} />
      </mesh>
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {user.name}
      </Text>
      
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color={user.color} transparent opacity={0.3} side={2} />
      </mesh>
    </group>
  );
}
