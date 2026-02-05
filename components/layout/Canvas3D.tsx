'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Grid, 
  AxisHelper,
  Box,
  Cylinder,
  Torus,
  Text,
  Line
} from '@react-three/drei'
import { useToolStore } from '@/store/toolStore'
import * as THREE from 'three'

export default function Canvas3D() {
  const { showFieldLines, showFieldVectors } = useToolStore()

  return (
    <div className="relative w-full h-full bg-slate-950">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Grid */}
          <Grid
            position={[0, -2, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#475569"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#64748b"
            fadeDistance={25}
            infiniteGrid
          />

          {/* Axis Helper */}
          <axesHelper args={[5]} />

          {/* Sensor Model */}
          <SensorModel />

          {/* Magnet Model */}
          <MagnetModel />

          {/* Field Visualization */}
          {showFieldLines && <FieldLines />}
          {showFieldVectors && <FieldVectors />}

          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Suspense>
      </Canvas>

      {/* View Controls */}
      <ViewControls />
    </div>
  )
}

// Sensor 3D Model
function SensorModel() {
  const { configuration } = useToolStore()
  const sensor = configuration.sensor
  const pos = configuration.sensorPosition

  if (!sensor) {
    return (
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        No Sensor Selected
      </Text>
    )
  }

  const position: [number, number, number] = [pos.position.x, pos.position.y, pos.position.z]
  const rotation: [number, number, number] = [
    pos.rotation.x * Math.PI / 180,
    pos.rotation.y * Math.PI / 180,
    pos.rotation.z * Math.PI / 180
  ]

  return (
    <group position={position} rotation={rotation}>
      {/* Sensor Package */}
      <Box args={[3, 0.5, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
      </Box>
      
      {/* Sensor Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
      >
        {sensor.name}
      </Text>

      {/* Detection Zone Indicator */}
      <Cylinder args={[0.5, 0.5, 0.1, 32]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.5} emissive="#06b6d4" emissiveIntensity={0.3} />
      </Cylinder>
    </group>
  )
}

// Magnet 3D Model
function MagnetModel() {
  const { configuration } = useToolStore()
  const magnet = configuration.magnet
  const pos = configuration.magnetPosition

  if (!magnet) {
    return (
      <Text
        position={[0, -1, 0]}
        fontSize={0.5}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        No Magnet Selected
      </Text>
    )
  }

  const position: [number, number, number] = [pos.position.x, pos.position.y, pos.position.z]
  const rotation: [number, number, number] = [
    pos.rotation.x * Math.PI / 180,
    pos.rotation.y * Math.PI / 180,
    pos.rotation.z * Math.PI / 180
  ]

  const dims = magnet.dimensions

  return (
    <group position={position} rotation={rotation}>
      {magnet.shape === 'cylinder' && (
        <Cylinder
          args={[(dims.diameter || 6) / 2, (dims.diameter || 6) / 2, dims.height || 3, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.2} />
        </Cylinder>
      )}

      {magnet.shape === 'ring' && (
        <Torus
          args={[(dims.outerDiameter || 15) / 2, ((dims.outerDiameter || 15) - (dims.innerDiameter || 8)) / 2, 16, 100]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.2} />
        </Torus>
      )}

      {magnet.shape === 'rectangle' && (
        <Box args={[dims.length || 10, dims.height || 3, dims.width || 5]}>
          <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.2} />
        </Box>
      )}

      {/* Magnet Label */}
      <Text
        position={[0, (dims.height || 3) / 2 + 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
      >
        {magnet.name}
      </Text>

      {/* North Pole Indicator */}
      <mesh position={[(dims.diameter || 6) / 2 + 0.5, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[(dims.diameter || 6) / 2 + 0.5, 0.4, 0]}
        fontSize={0.2}
        color="#ef4444"
      >
        N
      </Text>

      {/* South Pole Indicator */}
      <mesh position={[-(dims.diameter || 6) / 2 - 0.5, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[-(dims.diameter || 6) / 2 - 0.5, 0.4, 0]}
        fontSize={0.2}
        color="#3b82f6"
      >
        S
      </Text>
    </group>
  )
}

// Field Lines Visualization
function FieldLines() {
  const { configuration } = useToolStore()
  
  if (!configuration.magnet) return null

  const lines = []
  const numLines = 12
  
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2
    const radius = 4
    
    const points = []
    for (let t = 0; t <= 1; t += 0.1) {
      const x = Math.cos(angle) * radius * (0.5 + t * 1.5)
      const y = Math.sin(angle) * Math.sin(t * Math.PI) * 2
      const z = Math.sin(angle) * radius * (0.5 + t * 1.5)
      points.push(new THREE.Vector3(x, y, z))
    }
    
    lines.push(
      <Line
        key={i}
        points={points}
        color="#22d3ee"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    )
  }

  return <>{lines}</>
}

// Field Vectors Visualization
function FieldVectors() {
  const { configuration } = useToolStore()
  
  if (!configuration.magnet) return null

  const vectors = []
  const gridSize = 5
  const spacing = 2
  
  for (let x = -gridSize; x <= gridSize; x += spacing) {
    for (let y = -gridSize; y <= gridSize; y += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        if (x === 0 && y === 0 && z === 0) continue
        
        vectors.push(
          <FieldVector
            key={`${x}-${y}-${z}`}
            position={[x, y, z]}
          />
        )
      }
    }
  }

  return <>{vectors}</>
}

// Individual Field Vector
function FieldVector({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(0, 0, 0)
    }
  })

  const distance = Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2)
  const scale = Math.max(0.2, 1 / (distance * 0.3))

  return (
    <mesh ref={ref} position={position} scale={[scale, scale, scale]}>
      <coneGeometry args={[0.1, 0.4, 8]} rotation={[Math.PI / 2, 0, 0]} />
      <meshStandardMaterial color="#a855f7" transparent opacity={0.6} />
    </mesh>
  )
}

// View Controls Overlay
function ViewControls() {
  const { showFieldLines, showFieldVectors, toggleFieldLines, toggleFieldVectors } = useToolStore()

  return (
    <div className="absolute bottom-4 left-4 flex gap-2">
      <button
        onClick={toggleFieldLines}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          showFieldLines
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        Field Lines
      </button>
      <button
        onClick={toggleFieldVectors}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          showFieldVectors
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        Field Vectors
      </button>
    </div>
  )
}
