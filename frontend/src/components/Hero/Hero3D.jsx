import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

function Atmosphere() {
  return (
    <mesh scale={[1.06, 1.06, 1.06]}> 
      <sphereGeometry args={[1.5, 64, 64]} />
  <meshBasicMaterial color="#0ea5e9" transparent opacity={0.08} side={THREE.BackSide} />
    </mesh>
  );
}

function Globe() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
  <meshStandardMaterial color="#93c5fd" metalness={0.15} roughness={0.9} />
      </mesh>
      {/* Stylized meridians/parallels */}
      <mesh>
        <sphereGeometry args={[1.502, 32, 32]} />
  <meshBasicMaterial color="#94a3b8" wireframe transparent opacity={0.35} />
  <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.35} />
      </mesh>
      <Atmosphere />
    </group>
  );
}

function latLonToVec3(lat, lon, radius = 1.5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Arc({ from = [40.7, -74], to = [51.5, -0.12], color = '#22d3ee' }) {
  const start = useMemo(() => latLonToVec3(from[0], from[1]), [from]);
  const end = useMemo(() => latLonToVec3(to[0], to[1]), [to]);
  const mid = useMemo(() => {
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const dir = midpoint.clone().normalize();
    const height = 0.6; // arc height above the sphere
    return dir.multiplyScalar(1.5 + height);
  }, [start, end]);

  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, end), [start, mid, end]);
  const points = useMemo(() => curve.getPoints(64), [curve]);

  return <Line points={points} color={color} lineWidth={2} transparent opacity={0.8} />;
}

function Plane({ radius = 1.8, speed = 0.4 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    const t = ref.current.rotation.y;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.7) * 0.15;
    ref.current.position.set(x, y, z);
    ref.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref}>
  {/* Simple stylized plane in blue tones */}
      <mesh castShadow position={[0, 0, 0]}>
        <coneGeometry args={[0.06, 0.25, 16]} />
  <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh castShadow position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.16, 0.05, 0.05]} />
  <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh castShadow position={[-0.08, 0.03, 0]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.1, 0.01, 0.25]} />
  <meshStandardMaterial color="#bae6fd" />
      </mesh>
      <mesh castShadow position={[-0.08, -0.03, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.1, 0.01, 0.25]} />
  <meshStandardMaterial color="#bae6fd" />
      </mesh>
    </group>
  );
}

function Scene() {
  const group = useRef();
  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer; // normalized -1..1 in both axes
    const targetY = x * Math.PI * 0.35; // rotate around Y with cursor X
    const targetX = -y * Math.PI * 0.2; // rotate around X with cursor Y
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
    // subtle idle motion when pointer is near center
    if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
      group.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Globe />
      {/* A couple of flight arcs */}
      <Arc from={[40.7128, -74.0060]} to={[51.5074, -0.1278]} color="#22d3ee" />
  <Arc from={[40.7128, -74.0060]} to={[51.5074, -0.1278]} color="#0ea5e9" />
  <Arc from={[28.6139, 77.2090]} to={[35.6762, 139.6503]} color="#3b82f6" />
  <Arc from={[34.0522, -118.2437]} to={[48.8566, 2.3522]} color="#60a5fa" />
      <Plane />
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}> 
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
      <Scene />
    </Canvas>
  );
}
