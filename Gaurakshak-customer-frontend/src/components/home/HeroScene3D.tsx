'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const deterministicValue = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

// ─── Theme-Reactive Aura Ribbons ──────────────────────────────────────────
interface AuraRibbonsProps {
  color: string;
  accent: string;
  mousePos: { x: number; y: number };
  scrollYRef: React.RefObject<number>;
}

function AuraRibbons({ color, accent, mousePos, scrollYRef }: AuraRibbonsProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const smoothedScroll = useRef(0);
  const ribbonCount = 3;
  const segmentCount = 120;

  const ribbons = useMemo(() => {
    return Array.from({ length: ribbonCount }).map((_, ribbonIndex) => {
      const points = new Float32Array(segmentCount * 3);
      const phase = (ribbonIndex / ribbonCount) * Math.PI * 2;

      for (let i = 0; i < segmentCount; i++) {
        const progress = i / (segmentCount - 1);
        const angle = progress * Math.PI * 2;
        const radius = 2.2 + ribbonIndex * 0.5;
        points[i * 3] = Math.cos(angle + phase) * radius;
        points[i * 3 + 1] = Math.sin(angle * 2 + phase) * 0.22;
        points[i * 3 + 2] = Math.sin(angle + phase) * radius;
      }

      return points;
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    groupRef.current.rotation.x = 0.55 + mousePos.y * 0.12 + scrollRatio * 0.12;
    groupRef.current.rotation.y = t * 0.06 + mousePos.x * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.08;

    groupRef.current.children.forEach((child, ribbonIndex) => {
      const line = child as THREE.Line;
      const attribute = line.geometry.attributes.position;
      const arr = attribute.array as Float32Array;
      const phase = (ribbonIndex / ribbonCount) * Math.PI * 2;
      const radiusBase = 2.35 + ribbonIndex * 0.48 + scrollRatio * 0.45;

      for (let i = 0; i < segmentCount; i++) {
        const progress = i / (segmentCount - 1);
        const angle = progress * Math.PI * 2;
        const wave = Math.sin(t * 0.7 + angle * 3 + phase) * 0.18;
        const radius = radiusBase + wave;

        arr[i * 3] = Math.cos(angle + t * 0.12 + phase) * radius;
        arr[i * 3 + 1] = Math.sin(angle * 2 + t * 0.45 + phase) * (0.26 + scrollRatio * 0.08);
        arr[i * 3 + 2] = Math.sin(angle + t * 0.12 + phase) * radius;
      }

      attribute.needsUpdate = true;
      line.rotation.y = t * (0.08 + ribbonIndex * 0.025);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.65, 0.7]}>
      {ribbons.map((points, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[points, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={idx === 1 ? accent : color}
            transparent
            opacity={idx === 1 ? 0.42 : 0.34}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}

// ─── Orbiting Gem Beads Around The Lotus Core ─────────────────────────────
interface OrbitingBeadsProps {
  color: string;
  accent: string;
  scrollYRef: React.RefObject<number>;
}

function OrbitingBeads({ color, accent, scrollYRef }: OrbitingBeadsProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const smoothedScroll = useRef(0);
  const beadCount = 18;

  const beads = useMemo(() => (
    Array.from({ length: beadCount }).map((_, i) => ({
      angle: (i / beadCount) * Math.PI * 2,
      radius: 1.45 + (i % 3) * 0.18,
      yOffset: (i % 2 === 0 ? 1 : -1) * 0.1,
      size: 0.045 + (i % 4) * 0.008,
    }))
  ), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    groupRef.current.rotation.y = t * 0.28 + scrollRatio * 1.2;
    groupRef.current.rotation.x = 0.18 + Math.sin(t * 0.35) * 0.08;

    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const bead = beads[i];
      const angle = bead.angle + t * (0.18 + (i % 3) * 0.035);
      const radius = bead.radius + scrollRatio * 0.2 + Math.sin(t * 1.2 + i) * 0.04;

      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = bead.yOffset + Math.sin(t * 1.6 + i * 0.7) * 0.12;

      const pulse = 1 + Math.sin(t * 2.4 + i) * 0.18;
      mesh.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 1.2]}>
      {beads.map((bead, i) => (
        <mesh key={i} position={[0, bead.yOffset, 0]}>
          <sphereGeometry args={[bead.size, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color : accent}
            emissive={i % 2 === 0 ? color : accent}
            emissiveIntensity={2}
            roughness={0.2}
            metalness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Kundalini Dual-Spiral Vortex Particle Field ──────────────────────────
interface KundaliniVortexProps {
  mousePos: { x: number; y: number };
  scrollYRef: React.RefObject<number>;
}

function KundaliniVortex({ mousePos, scrollYRef }: KundaliniVortexProps) {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 850;
  const smoothedScroll = useRef(0);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 2 spiral arms wrapping around the center axis (Ida & Pingala energy channels)
      const arm = i % 2;
      const progress = i / count;

      // Logarithmic spiral coordinates
      const angle = progress * Math.PI * 9 + (arm * Math.PI);
      const radius = 0.5 + progress * 8.5; // Start tight, spread wide
      const y = (progress - 0.5) * 11;     // Column height range from -5.5 to +5.5

      // Add random spiral dispersion
      const spread = 0.1 + progress * 0.9;
      const dx = (deterministicValue(i + 1) - 0.5) * spread;
      const dy = (deterministicValue(i + 2) - 0.5) * spread;
      const dz = (deterministicValue(i + 3) - 0.5) * spread;

      pos[i * 3] = Math.cos(angle) * radius + dx;
      pos[i * 3 + 1] = y + dy;
      pos[i * 3 + 2] = Math.sin(angle) * radius + dz;

      // Spiritual color palette (Gold, Saffron, Pure Light)
      const rVal = deterministicValue(i + 4);
      if (rVal < 0.45) {
        // Divine Gold
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.84;
        col[i * 3 + 2] = 0.0;
      } else if (rVal < 0.85) {
        // Sacred Saffron
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.42;
        col[i * 3 + 2] = 0.0;
      } else {
        // Warm White / Pure Consciousness
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 0.85;
      }

      siz[i] = deterministicValue(i + 5) * 4.5 + 1.0;
    }
    return [pos, col, siz];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * 0.3; // Slower time (30% speed)

    // Smooth scroll interpolation
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    // Rotate vortex and skew based on mouse position
    meshRef.current.rotation.y = time * 0.06 + mousePos.x * 0.4;
    meshRef.current.rotation.x = mousePos.y * 0.25;

    // Stretch particles vertically along Y axis on scroll (Kundalini energy rising)
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array;
    const stretchY = 1 + scrollRatio * 0.85;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const originalY = positions[idx + 1];
      posArr[idx + 1] = originalY * stretchY + Math.sin(time * 0.3 + i * 0.05) * 0.15;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Concentric Sri Yantra / Sacred Mandala Grid ───────────────────────────
interface SriYantraMandalaProps {
  color: string;
  scrollYRef: React.RefObject<number>;
}

function SriYantraMandala({ color, scrollYRef }: SriYantraMandalaProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const smoothedScroll = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.3; // Slower time (30% speed)

    // Smooth scroll interpolation
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    // Rotate different layers of the yantra at offset speeds and explode on Z-axis
    const children = groupRef.current.children;

    // Ring 1 (Outer Lotus Ring): goes further back
    if (children[0]) {
      children[0].rotation.z = t * 0.04;
      children[0].position.z = -scrollRatio * 2.5;
    }
    // Bhupura square gates: moderate push back
    if (children[1]) {
      children[1].rotation.z = -t * 0.05;
      children[1].position.z = -scrollRatio * 1.2;
    }
    // Triangles: push forward
    if (children[2]) {
      children[2].rotation.z = t * 0.06;
      children[2].position.z = scrollRatio * 1.2;
    }
    // Concentric Bindu circles: push further forward
    if (children[3]) {
      children[3].rotation.z = -t * 0.02;
      children[3].position.z = scrollRatio * 2.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.8, -2.5]}>
      {/* Outer Lotus Ring Mandala (16-segmented outer wheel) */}
      <mesh>
        <ringGeometry args={[3.8, 3.86, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Sacred Bhupura (Double Gate of Yantra - Square frames) */}
      <group>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[2.8, 2.84, 4]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[2.8, 2.84, 4]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Intersecting Sacred Triangles (Union of Shiva & Shakti) */}
      <group>
        {/* Shiva (Pointing Up) */}
        <mesh position={[0, 0.2, 0.01]}>
          <circleGeometry args={[1.5, 3]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        {/* Shakti (Pointing Down) */}
        <mesh position={[0, -0.2, 0.02]} rotation={[0, 0, Math.PI]}>
          <circleGeometry args={[1.5, 3]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Concentric Bindu Circles */}
      <mesh>
        <ringGeometry args={[0.8, 0.82, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.5, 0.51, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Blooming 3D Lotus Flower (Bespoke Shape Extruded mesh) ─────────────────
interface BloomingLotusProps {
  color: string;
  scrollYRef: React.RefObject<number>;
}

function BloomingLotus({ color, scrollYRef }: BloomingLotusProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const haloRef = useRef<THREE.Group>(null!);
  const coreLightRef = useRef<THREE.PointLight>(null!);
  const smoothedScroll = useRef(0);

  // Dynamic Petal Bezier Shape
  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    // Draw right curve
    shape.quadraticCurveTo(0.3, 0.4, 0.25, 0.8);
    shape.quadraticCurveTo(0.1, 1.2, 0, 1.4); // Tip
    // Draw left curve
    shape.quadraticCurveTo(-0.1, 1.2, -0.25, 0.8);
    shape.quadraticCurveTo(-0.3, 0.4, 0, 0);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01
  }), []);

  // Generate petal positions for 3 concentric layers
  const layers = useMemo(() => {
    const items = [];

    // Outer Layer: 12 petals, tilted outwards, radius = 0.9, scale = 0.9
    for (let i = 0; i < 12; i++) {
      items.push({
        angle: (i / 12) * Math.PI * 2,
        tilt: 0.8,
        scale: 0.9,
        radius: 0.9,
      });
    }

    // Middle Layer: 8 petals, mid tilt, radius = 0.6, scale = 0.75
    for (let i = 0; i < 8; i++) {
      items.push({
        angle: (i / 8) * Math.PI * 2 + (Math.PI / 8), // stagger
        tilt: 0.5,
        scale: 0.75,
        radius: 0.6,
      });
    }

    // Inner Layer: 5 petals, slight tilt, radius = 0.35, scale = 0.6
    for (let i = 0; i < 5; i++) {
      items.push({
        angle: (i / 5) * Math.PI * 2 + (Math.PI / 5),
        tilt: 0.25,
        scale: 0.6,
        radius: 0.35,
      });
    }

    return items;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.3; // Slower time (30% speed)

    // Smooth scroll interpolation
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    // Majestic slow rotation - spins faster as you scroll
    groupRef.current.rotation.y = t * 0.12 + scrollRatio * Math.PI * 1.2;
    // Tilts forward on scroll
    groupRef.current.rotation.x = scrollRatio * 0.4;

    // Breathing/Blooming motion (Pulse size)
    const breathe = 1 + Math.sin(t * 1.0) * 0.03;
    groupRef.current.scale.set(breathe, breathe, breathe);

    if (haloRef.current) {
      haloRef.current.rotation.z = -t * 0.18;
      haloRef.current.scale.setScalar(1 + scrollRatio * 0.18 + Math.sin(t * 1.4) * 0.035);
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = 2.4 + Math.sin(t * 2.5) * 0.35 + scrollRatio * 0.8;
      coreLightRef.current.distance = 6 + scrollRatio * 2;
    }

    // Waving movement on individual petals + blooms open wider on scroll
    const children = groupRef.current.children;
    // Skip index 0-2 (halo/core light/core sphere)
    for (let idx = 3; idx < children.length; idx++) {
      const petalMesh = children[idx] as THREE.Mesh;
      if (petalMesh && petalMesh.userData) {
        const baseTilt = petalMesh.userData.baseTilt || 0.5;
        const bloomOffset = scrollRatio * 0.45;
        petalMesh.rotation.x = baseTilt + bloomOffset + Math.sin(t * 1.2 + idx * 0.25) * 0.035;
        petalMesh.rotation.z = Math.sin(t * 0.9 + idx * 0.4) * 0.018;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 1.2]}>
      {/* Soft prismatic halo below the bloom */}
      <group ref={haloRef} position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[1.15, 1.22, 96]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[1.62, 1.66, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <pointLight ref={coreLightRef} position={[0, 0.2, 0]} color={color} intensity={2.4} distance={6} decay={1.8} />

      {/* Central Glowing Bindu Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={1.8}
          roughness={0.1}
        />
      </mesh>

      {/* Blooming Petals */}
      {layers.map((p, idx) => {
        const x = Math.cos(p.angle) * p.radius;
        const z = Math.sin(p.angle) * p.radius;
        const rotY = -p.angle + Math.PI / 2; // Face petal outwards

        return (
          <mesh
            key={idx}
            position={[x, 0, z]}
            rotation={[p.tilt, rotY, 0]}
            scale={[p.scale, p.scale, p.scale]}
            userData={{ baseTilt: p.tilt }}
          >
            <extrudeGeometry args={[petalShape, extrudeSettings]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.55}
              roughness={0.16}
              metalness={0.18}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Floating Holy Diya (3D Clay Lamp with flickering flame) ────────────────
interface HolyDiyaProps {
  position: [number, number, number];
  color: string;
  scrollYRef: React.RefObject<number>;
  dispDirection: number; // -1 for left, 1 for right, 0 for center
}

function HolyDiya({ position, color, scrollYRef, dispDirection }: HolyDiyaProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const flameRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const smoothedScroll = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth scroll interpolation
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    if (flameRef.current) {
      // Waver and flicker the flame mesh - calmer flickering
      const wave = Math.sin(t * 8) * 0.04;
      const flicker = 1 + Math.sin(t * 12) * 0.04 + Math.cos(t * 18) * 0.03;
      flameRef.current.scale.set(flicker, flicker * 1.1 + Math.sin(t * 16) * 0.05, flicker);
      flameRef.current.rotation.z = wave;
    }
    if (lightRef.current) {
      // Flicker point light intensity dynamically
      lightRef.current.intensity = 2.0 + Math.sin(t * 10) * 0.2;
    }

    if (groupRef.current) {
      // Disperse diyas outward horizontally and push back on Z-axis as user scrolls down
      const displaceX = dispDirection * scrollRatio * 3.5;
      groupRef.current.position.x = position[0] + displaceX;
      groupRef.current.position.z = position[2] - scrollRatio * 1.5;
    }
  });

  return (
    // Slower floating speed & lower float amplitude for a serene look
    <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={position}>
        {/* Clay Bowl (Terracotta base) */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.3, 0.18, 0.18, 16]} />
          <meshStandardMaterial
            color="#a0522d" // Sienna terracotta
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Glowing Oil/Ghee pool */}
        <mesh position={[0, -0.07, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.02, 16]} />
          <meshStandardMaterial
            color="#ffd700"
            roughness={0.15}
            metalness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Cotton Wick */}
        <mesh position={[0, -0.04, 0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshBasicMaterial color="#222222" />
        </mesh>

        {/* Flickering Flame */}
        <mesh ref={flameRef} position={[0, 0.08, 0.06]}>
          <coneGeometry args={[0.06, 0.2, 16]} />
          <meshBasicMaterial
            color="#FF8C00"
            toneMapped={false}
          />
        </mesh>

        {/* Point Light Casting Glow */}
        <pointLight
          ref={lightRef}
          position={[0, 0.16, 0.06]}
          color={color}
          intensity={2.2}
          distance={8}
          decay={1.8}
        />
      </group>
    </Float>
  );
}

// ─── Camera Mouse & Scroll Controller ─────────────────────────────────────
function CameraController({ mousePos, scrollYRef }: { mousePos: { x: number; y: number }; scrollYRef: React.RefObject<number> }) {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  const smoothedScroll = useRef(0);

  /* eslint-disable react-hooks/immutability */
  useFrame(() => {
    // 1. Mouse rotation
    targetRotation.current.x = mousePos.y * 0.15;
    targetRotation.current.y = mousePos.x * 0.15;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.03;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.03;

    // 2. Scroll camera translation
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    // Zoom back slightly on scroll - zoom out less so it remains beautifully visible and large in the center
    const targetZ = 8 + scrollRatio * 1.5;
    // Balanced upward movement to keep it centered and visible from the top
    const targetY = scrollRatio * 1.4;

    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

// ─── Indian Rashi Chakra (12 Zodiac Signs with Dynamic Textures) ───────────
const RASHIS = [
  { hindi: 'मेष', english: 'Aries', symbol: '♈' },
  { hindi: 'वृषभ', english: 'Taurus', symbol: '♉' },
  { hindi: 'मिथुन', english: 'Gemini', symbol: '♊' },
  { hindi: 'कर्क', english: 'Cancer', symbol: '♋' },
  { hindi: 'सिंह', english: 'Leo', symbol: '♌' },
  { hindi: 'कन्या', english: 'Virgo', symbol: '♍' },
  { hindi: 'तुला', english: 'Libra', symbol: '♎' },
  { hindi: 'वृश्चिक', english: 'Scorpio', symbol: '♏' },
  { hindi: 'धनु', english: 'Sagittarius', symbol: '♐' },
  { hindi: 'मकर', english: 'Capricorn', symbol: '♑' },
  { hindi: 'कुंभ', english: 'Aquarius', symbol: '♒' },
  { hindi: 'मीन', english: 'Pisces', symbol: '♓' }
];

interface RashiChakraProps {
  color: string;
  scrollYRef: React.RefObject<number>;
}

function RashiChakra({ color, scrollYRef }: RashiChakraProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const smoothedScroll = useRef(0);
  const [textures, setTextures] = React.useState<THREE.CanvasTexture[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const createdTextures = RASHIS.map((rashi) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 256, 256);

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;

      // Draw elegant concentric Sanskrit/Vedic circle
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(128, 128, 110, 0, Math.PI * 2);
      ctx.stroke();

      // Outer dotted line
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(128, 128, 118, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw faint sacred sunburst/rays from center
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 8; j++) {
        const rayAngle = (j / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(128 + Math.cos(rayAngle) * 20, 128 + Math.sin(rayAngle) * 20);
        ctx.lineTo(128 + Math.cos(rayAngle) * 105, 128 + Math.sin(rayAngle) * 105);
        ctx.stroke();
      }

      // Draw Zodiac Symbol (Unicode Emoji)
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rashi.symbol, 128, 95);

      // Draw Hindi Name
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#FFD700'; // Divine Gold
      ctx.font = 'bold 24px "Noto Sans", sans-serif';
      ctx.fillText(rashi.hindi, 128, 155);

      // Draw English Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'italic 16px "Inter", sans-serif';
      ctx.fillText(rashi.english, 128, 185);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }).filter((t): t is THREE.CanvasTexture => t !== null);

    const timer = window.setTimeout(() => {
      setTextures(createdTextures);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      createdTextures.forEach((t) => t.dispose());
    };
  }, [color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.12; // Slow majestic rotation speed

    // Smooth scroll interpolation
    smoothedScroll.current += ((scrollYRef.current || 0) - smoothedScroll.current) * 0.08;
    const scrollRatio = Math.min(smoothedScroll.current / window.innerHeight, 1.5);

    // Rotate entire chakra
    groupRef.current.rotation.y = t + scrollRatio * 0.8;
    // Slight sway rotation
    groupRef.current.rotation.x = 0.35 + Math.sin(t * 0.5) * 0.05 + scrollRatio * 0.2;

    // Apply individual floating / waving to each Rashi sprite
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const sprite = children[i] as THREE.Sprite;
      if (sprite) {
        // Individual float up/down
        const floatOffset = Math.sin(t * 1.5 + i * 0.8) * 0.15;
        // Radial breathe effect
        const baseAngle = (i / 12) * Math.PI * 2;
        const baseRadius = 5.2 + scrollRatio * 1.5;
        const currentRadius = baseRadius + Math.sin(t * 1.0 + i) * 0.1;

        sprite.position.x = Math.cos(baseAngle) * currentRadius;
        sprite.position.z = Math.sin(baseAngle) * currentRadius;
        sprite.position.y = floatOffset;

        // Pulse size slightly
        const pulse = 1.0 + Math.sin(t * 2.0 + i) * 0.05;
        sprite.scale.set(1.4 * pulse, 1.4 * pulse, 1.4 * pulse);
      }
    }
  });

  if (textures.length === 0) return null;

  return (
    <group ref={groupRef} position={[0, 1.2, -0.5]}>
      {/* 12 Rashi Sprites arranged in a circle */}
      {textures.map((texture, idx) => {
        const angle = (idx / 12) * Math.PI * 2;
        const radius = 5.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <sprite
            key={idx}
            position={[x, 0, z]}
            scale={[1.4, 1.4, 1.4]}
          >
            <spriteMaterial
              map={texture}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}

// ─── Main 3D Scene Component ─────────────────────────────────────────────
interface HeroScene3DProps {
  activeTheme: number;
  mousePos: { x: number; y: number };
}

export default function HeroScene3D({ activeTheme, mousePos }: HeroScene3DProps) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeColors = useMemo(() => [
    { primary: '#FFD700', secondary: '#FF6B00', accent: '#FF9F43' },  // Gau Seva: Gold / Saffron
    { primary: '#FF6B00', secondary: '#800020', accent: '#B31E3F' },  // Katha: Saffron / Crimson
    { primary: '#FF9F43', secondary: '#FFD700', accent: '#FF6B00' },  // Ramji: Orange / Gold
  ], []);

  const currentColors = themeColors[activeTheme] || themeColors[0];

  return (
    <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
        <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient base lighting */}
        <ambientLight intensity={0.32} />
        <directionalLight position={[4, 6, 5]} intensity={0.65} color="#fff3d0" />
        <pointLight position={[-3.5, 2.8, 2]} intensity={1.4} color={currentColors.secondary} distance={10} />

        {/* Camera responds to mouse and scroll */}
        <CameraController mousePos={mousePos} scrollYRef={scrollYRef} />

        {/* Cosmic Starfield */}
        <Stars
          radius={50}
          depth={80}
          count={1400}
          factor={3}
          saturation={0.3}
          fade
          speed={0.8}
        />

        {/* Indian Rashi Chakra */}
        <RashiChakra color={currentColors.primary} scrollYRef={scrollYRef} />

        {/* Sri Yantra sacred geometry */}
        <SriYantraMandala color={currentColors.primary} scrollYRef={scrollYRef} />

        {/* Luminous orbit paths around the focal bloom */}
        <AuraRibbons
          color={currentColors.primary}
          accent={currentColors.accent}
          mousePos={mousePos}
          scrollYRef={scrollYRef}
        />

        {/* Blooming 3D Lotus Flower */}
        <BloomingLotus color={currentColors.primary} scrollYRef={scrollYRef} />

        {/* Orbiting devotional gem particles */}
        <OrbitingBeads
          color={currentColors.primary}
          accent={currentColors.accent}
          scrollYRef={scrollYRef}
        />

        {/* Kundalini double-spiral particle field */}
        <KundaliniVortex mousePos={mousePos} scrollYRef={scrollYRef} />

        {/* Floating Holy Diyas (Lamps) with dispersion directions */}
        <HolyDiya position={[-4.5, 2.8, -2.5]} color={currentColors.primary} scrollYRef={scrollYRef} dispDirection={-1} />
        <HolyDiya position={[5, -1.0, -3.5]} color={currentColors.secondary} scrollYRef={scrollYRef} dispDirection={1} />
        <HolyDiya position={[-3, -2.0, -2]} color={currentColors.accent} scrollYRef={scrollYRef} dispDirection={-0.6} />
        <HolyDiya position={[4.2, 2.6, -4]} color="#FF8C00" scrollYRef={scrollYRef} dispDirection={0.8} />
      </Canvas>
    </div>
  );
}
