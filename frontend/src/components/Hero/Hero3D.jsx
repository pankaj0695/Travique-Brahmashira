import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import styles from './Hero3D.module.css';

// Animated particles component
function AnimatedParticles() {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const particleCount = 50;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 4
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className={styles.particles}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
}

function Atmosphere() {
  return (
    <mesh scale={[1.06, 1.06, 1.06]}> 
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshBasicMaterial 
        color="#0ea5e9" 
        transparent 
        opacity={0.08} 
        side={THREE.BackSide} 
      />
    </mesh>
  );
}

function Globe() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
  <meshStandardMaterial color="#93c5fd" metalness={0.15} roughness={0.9} />
      </mesh>
      {/* Stylized meridians/parallels */}
      <mesh>
        <sphereGeometry args={[1.502, 32, 32]} />
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

// Floating elements around globe
function FloatingElements() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
  return (
    <>
      {colors.map((color, index) => (
        <FloatingElement key={index} color={color} index={index} />
      ))}
    </>
  );
}

function FloatingElement({ color, index }) {
  const ref = useRef();
  const radius = 2.2;
  const speed = 0.3 + index * 0.1;
  const offset = (index * Math.PI) / 2;
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const y = Math.sin(t * 0.5) * 0.3;
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Arc({ from = [40.7, -74], to = [51.5, -0.12], color }) {
  const arcColor = color || '#22d3ee';
  
  const start = useMemo(() => latLonToVec3(from[0], from[1]), [from]);
  const end = useMemo(() => latLonToVec3(to[0], to[1]), [to]);
  const mid = useMemo(() => {
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const dir = midpoint.clone().normalize();
    const height = 0.6;
    return dir.multiplyScalar(1.5 + height);
  }, [start, end]);

  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, end), [start, mid, end]);
  const points = useMemo(() => curve.getPoints(64), [curve]);

  return <Line points={points} color={arcColor} lineWidth={2} transparent opacity={0.8} />;
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

  const planeColor = "#0284c7";
  const wingColor = "#bae6fd";

  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0, 0]}>
        <coneGeometry args={[0.06, 0.25, 16]} />
        <meshStandardMaterial color={planeColor} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh castShadow position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.16, 0.05, 0.05]} />
        <meshStandardMaterial color={planeColor} />
      </mesh>
      <mesh castShadow position={[-0.08, 0.03, 0]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.1, 0.01, 0.25]} />
        <meshStandardMaterial color={wingColor} />
      </mesh>
      <mesh castShadow position={[-0.08, -0.03, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.1, 0.01, 0.25]} />
        <meshStandardMaterial color={wingColor} />
      </mesh>
    </group>
  );
}

function Scene() {
  const group = useRef();
  
  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    const targetY = x * Math.PI * 0.35;
    const targetX = -y * Math.PI * 0.2;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
    
    if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
      group.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Globe />
      <FloatingElements />
      <Arc from={[40.7128, -74.0060]} to={[51.5074, -0.1278]} />
      <Arc from={[35.6762, 139.6503]} to={[28.6139, 77.2090]} />
      <Arc from={[34.0522, -118.2437]} to={[48.8566, 2.3522]} />
      <Arc from={[-33.8688, 151.2093]} to={[1.3521, 103.8198]} />
      <Plane />
    </group>
  );
}

// Enhanced Hero3D component with animations
export default function Hero3D() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleGetStarted = () => {
    if (user) {
      navigate('/plan');
    } else {
      navigate('/signup');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      setMousePosition({ x: mouseX, y: mouseY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const backgroundStyle = {
    transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`
  };

  return (
    <div className={styles.hero3DContainer}>
      <AnimatedParticles />
      
      <div className={styles.heroContent}>
        <div className={styles.globeContainer} style={backgroundStyle}>
          <Canvas 
            shadows 
            camera={{ position: [0, 0, 5], fov: 50 }} 
            dpr={[1, 2]}
            className={styles.canvas}
          > 
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
            <Scene />
          </Canvas>
          
          <div className={styles.airplane}>✈</div>
        </div>

        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Plan Smart.<br />Travel Smarter.
          </h1>
          <p className={styles.heroSubtitle}>
            Plan trips collaboratively, discover new places, and track every booking — all in one smart tool.
          </p>
        </div>

        <button className={styles.ctaButton} onClick={handleGetStarted}>
          <span className={styles.ctaIcon}>🚀</span>
          Get Started
        </button>
      </div>
    </div>
  );
}
