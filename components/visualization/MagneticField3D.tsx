'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Cylinder, Torus, Text, Line, Sphere } from '@react-three/drei'
import { useToolStore } from '@/store/toolStore'
import * as THREE from 'three'
import { calculateMagneticField } from '@/lib/simulation/magnetic-field'

// 磁场可视化主组件
export default function MagneticField3D() {
  const { configuration, showFieldLines, showFieldVectors, showHeatmap } = useToolStore()
  const { sensor, sensorPosition, magnet, magnetPosition } = configuration

  return (
    <div className="relative w-full h-full bg-slate-950">
      <Canvas
        camera={{ position: [15, 15, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        {/* 网格 */}
        <Grid
          position={[0, -3, 0]}
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.3}
          cellColor="#334155"
          sectionSize={5}
          sectionThickness={0.8}
          sectionColor="#475569"
          fadeDistance={40}
          infiniteGrid
        />

        {/* 坐标轴 */}
        <AxesHelper />

        {/* 传感器模型 */}
        {sensor && <Sensor3D position={sensorPosition.position} rotation={sensorPosition.rotation} name={sensor.name} />}

        {/* 磁铁模型 */}
        {magnet && (
          <Magnet3D 
            position={magnetPosition.position} 
            rotation={magnetPosition.rotation}
            magnet={magnet}
          />
        )}

        {/* 磁场可视化 */}
        {magnet && showFieldLines && <MagneticFieldLines magnet={magnet} magnetPosition={magnetPosition} />}
        {magnet && showFieldVectors && <MagneticFieldVectors magnet={magnet} magnetPosition={magnetPosition} />}
        {magnet && showHeatmap && <FieldStrengthHeatmap magnet={magnet} magnetPosition={magnetPosition} />}

        {/* 传感器位置处的场强指示 */}
        {sensor && magnet && (
          <SensorFieldIndicator 
            sensorPos={sensorPosition.position}
            magnetPos={magnetPosition.position}
            magnet={magnet}
          />
        )}

        {/* 控制器 */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* 控制面板 */}
      <FieldControls />

      {/* 场强信息 */}
      {sensor && magnet && <FieldStrengthInfo />}
    </div>
  )
}

// 坐标轴辅助
function AxesHelper() {
  return (
    <group>
      {/* X轴 - 红色 */}
      <Line points={[new THREE.Vector3(0, -3, 0), new THREE.Vector3(8, -3, 0)]} color="#ef4444" lineWidth={2} />
      <Text position={[8.5, -3, 0]} fontSize={0.5} color="#ef4444">X</Text>
      
      {/* Y轴 - 绿色 */}
      <Line points={[new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 5, 0)]} color="#22c55e" lineWidth={2} />
      <Text position={[0, 5.5, 0]} fontSize={0.5} color="#22c55e">Y</Text>
      
      {/* Z轴 - 蓝色 */}
      <Line points={[new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, -3, 8)]} color="#3b82f6" lineWidth={2} />
      <Text position={[0, -3, 8.5]} fontSize={0.5} color="#3b82f6">Z</Text>
    </group>
  )
}

// 传感器3D模型
function Sensor3D({ position, rotation, name }: { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; name: string }) {
  const pos: [number, number, number] = [position.x / 5, position.y / 5 + 0.5, position.z / 5]
  const rot: [number, number, number] = [
    rotation.x * Math.PI / 180,
    rotation.y * Math.PI / 180,
    rotation.z * Math.PI / 180
  ]

  return (
    <group position={pos} rotation={rot}>
      {/* 传感器主体 */}
      <Box args={[1.2, 0.2, 1.2]}>
        <meshStandardMaterial color="#06b6d4" metalness={0.6} roughness={0.3} />
      </Box>
      
      {/* 传感器顶部标记 */}
      <Box args={[0.8, 0.05, 0.8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.3} />
      </Box>

      {/* 标签 */}
      <Text position={[0, 0.5, 0]} fontSize={0.25} color="#22d3ee" anchorX="center">
        {name}
      </Text>

      {/* 感应区域 */}
      <Cylinder args={[0.3, 0.3, 0.05, 32]} position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.4} />
      </Cylinder>
    </group>
  )
}

// 磁铁3D模型
function Magnet3D({ position, rotation, magnet }: { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; magnet: any }) {
  const pos: [number, number, number] = [position.x / 5, position.y / 5, position.z / 5]
  const rot: [number, number, number] = [
    rotation.x * Math.PI / 180,
    rotation.y * Math.PI / 180,
    rotation.z * Math.PI / 180
  ]

  const dims = magnet.dimensions
  const scale = 0.2 // 缩放因子

  return (
    <group position={pos} rotation={rot}>
      {magnet.shape === 'cylinder' && (
        <>
          <Cylinder
            args={[(dims.diameter || 6) * scale, (dims.diameter || 6) * scale, (dims.height || 3) * scale, 32]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.3} />
          </Cylinder>
          {/* 北极标记 */}
          <Sphere args={[0.15]} position={[(dims.diameter || 6) * scale + 0.2, 0, 0]}>
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[(dims.diameter || 6) * scale + 0.2, 0.3, 0]} fontSize={0.2} color="#ff0000">N</Text>
          
          {/* 南极标记 */}
          <Sphere args={[0.15]} position={[-(dims.diameter || 6) * scale - 0.2, 0, 0]}>
            <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[-(dims.diameter || 6) * scale - 0.2, 0.3, 0]} fontSize={0.2} color="#0066ff">S</Text>
        </>
      )}

      {magnet.shape === 'ring' && (
        <>
          <Torus
            args={[((dims.outerDiameter || 15) + (dims.innerDiameter || 8)) / 2 * scale, 
                   ((dims.outerDiameter || 15) - (dims.innerDiameter || 8)) / 2 * scale, 
                   16, 100]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.3} />
          </Torus>
        </>
      )}

      {magnet.shape === 'rectangle' && (
        <Box args={[(dims.length || 10) * scale, (dims.height || 3) * scale, (dims.width || 5) * scale]}>
          <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.3} />
        </Box>
      )}

      <Text position={[0, (dims.height || 3) * scale / 2 + 0.3, 0]} fontSize={0.2} color="#fca5a5" anchorX="center">
        {magnet.name}
      </Text>
    </group>
  )
}

// 磁力线可视化
function MagneticFieldLines({ magnet, magnetPosition }: { magnet: any; magnetPosition: any }) {
  const lines = useMemo(() => {
    const fieldLines = []
    const numLines = 16
    const numPoints = 50
    
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2
      const startRadius = (magnet.dimensions.diameter || 6) * 0.15
      
      const points: THREE.Vector3[] = []
      
      // 从磁铁表面开始
      let x = Math.cos(angle) * startRadius
      let y = 0
      let z = Math.sin(angle) * startRadius
      
      points.push(new THREE.Vector3(x, y, z))
      
      // 追踪磁力线
      for (let step = 0; step < numPoints; step++) {
        // 简化的磁场计算
        const r = Math.sqrt(x * x + y * y + z * z)
        if (r < 0.1 || r > 15) break
        
        const fieldStrength = 1 / (r * r)
        const dx = -x / r * fieldStrength * 0.5
        const dy = -y / r * fieldStrength * 0.5
        const dz = -z / r * fieldStrength * 0.5
        
        x += dx
        y += dy
        z += dz
        
        points.push(new THREE.Vector3(x, y, z))
      }
      
      if (points.length > 5) {
        fieldLines.push(
          <Line
            key={i}
            points={points}
            color="#22d3ee"
            lineWidth={2}
            transparent
            opacity={0.6}
          />
        )
      }
    }
    
    return fieldLines
  }, [magnet])

  return <group>{lines}</group>
}

// 磁场向量可视化
function MagneticFieldVectors({ magnet, magnetPosition }: { magnet: any; magnetPosition: any }) {
  const vectors = useMemo(() => {
    const fieldVectors = []
    const gridSize = 8
    const spacing = 1.5
    
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -3; y <= 5; y += spacing) {
        for (let z = -gridSize; z <= gridSize; z += spacing) {
          if (Math.abs(x) < 1 && Math.abs(y) < 1 && Math.abs(z) < 1) continue
          
          const r = Math.sqrt(x * x + y * y + z * z)
          if (r < 0.5 || r > 12) continue
          
          // 计算场强用于颜色
          const strength = Math.min(1, 5 / r)
          const color = strength > 0.5 ? '#f59e0b' : '#3b82f6'
          
          fieldVectors.push(
            <FieldArrow
              key={`${x}-${y}-${z}`}
              position={[x, y, z]}
              direction={[-x / r, -y / r, -z / r]}
              strength={strength}
              color={color}
            />
          )
        }
      }
    }
    
    return fieldVectors
  }, [magnet])

  return <group>{vectors}</group>
}

// 单个场向量箭头
function FieldArrow({ position, direction, strength, color }: { position: [number, number, number]; direction: [number, number, number]; strength: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    if (ref.current) {
      const lookAtPos = new THREE.Vector3(
        position[0] + direction[0],
        position[1] + direction[1],
        position[2] + direction[2]
      )
      ref.current.lookAt(lookAtPos)
    }
  }, [position, direction])

  const scale = Math.max(0.15, strength * 0.5)

  return (
    <mesh ref={ref} position={position} scale={[scale, scale, scale]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.1, 0.4, 8]} />
      <meshStandardMaterial color={color} transparent opacity={0.7} />
    </mesh>
  )
}

// 场强热力图
function FieldStrengthHeatmap({ magnet, magnetPosition }: { magnet: any; magnetPosition: any }) {
  const points = useMemo(() => {
    const heatmapPoints = []
    const gridSize = 6
    const spacing = 1.2
    
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        if (Math.abs(x) < 1 && Math.abs(z) < 1) continue
        
        const r = Math.sqrt(x * x + z * z)
        if (r < 0.5 || r > 10) continue
        
        const strength = Math.min(1, 8 / r)
        const y = -2.8 // 在网格上方一点
        
        // 根据场强选择颜色
        let color
        if (strength > 0.8) color = '#dc2626' // 红色 - 强
        else if (strength > 0.5) color = '#f59e0b' // 橙色 - 中
        else if (strength > 0.3) color = '#22c55e' // 绿色 - 弱
        else color = '#3b82f6' // 蓝色 - 很弱
        
        heatmapPoints.push(
          <mesh key={`${x}-${z}`} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
        )
      }
    }
    
    return heatmapPoints
  }, [magnet])

  return <group>{points}</group>
}

// 传感器位置场强指示器
function SensorFieldIndicator({ sensorPos, magnetPos, magnet }: { sensorPos: any; magnetPos: any; magnet: any }) {
  const relativePos = {
    x: (sensorPos.x - magnetPos.x) / 5,
    y: (sensorPos.y - magnetPos.y) / 5,
    z: (sensorPos.z - magnetPos.z) / 5
  }
  
  const distance = Math.sqrt(relativePos.x ** 2 + relativePos.y ** 2 + relativePos.z ** 2)
  const fieldStrength = magnet.remanence / (distance * distance + 0.1)
  
  // 根据场强选择颜色
  let color = '#22c55e'
  if (fieldStrength > 0.8) color = '#dc2626'
  else if (fieldStrength > 0.4) color = '#f59e0b'
  
  return (
    <group position={[relativePos.x, relativePos.y + 0.5, relativePos.z]}>
      {/* 场强指示环 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {/* 场强数值 */}
      <Text position={[0, 1, 0]} fontSize={0.25} color={color} anchorX="center">
        {(fieldStrength * 1000).toFixed(0)} mT
      </Text>
    </group>
  )
}

// 控制面板
function FieldControls() {
  const { showFieldLines, showFieldVectors, showHeatmap, toggleFieldLines, toggleFieldVectors, toggleHeatmap } = useToolStore()

  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
      <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-slate-700">
        <h3 className="text-xs font-semibold text-slate-400 mb-2">磁场可视化</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleFieldLines}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showFieldLines ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            磁力线
          </button>
          <button
            onClick={toggleFieldVectors}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showFieldVectors ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            场向量
          </button>
          <button
            onClick={toggleHeatmap}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showHeatmap ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            热力图
          </button>
        </div>
      </div>
      
      {/* 图例 */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-slate-700">
        <h3 className="text-xs font-semibold text-slate-400 mb-2">场强图例</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-slate-400">强 (&gt;80 mT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-400">中 (40-80 mT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-slate-400">弱 (20-40 mT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-400">很弱 (&lt;20 mT)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 场强信息显示
function FieldStrengthInfo() {
  const { configuration } = useToolStore()
  const { sensor, sensorPosition, magnet, magnetPosition } = configuration
  
  if (!sensor || !magnet) return null
  
  const relativePos = {
    x: sensorPosition.position.x - magnetPosition.position.x,
    y: sensorPosition.position.y - magnetPosition.position.y,
    z: sensorPosition.position.z - magnetPosition.position.z
  }
  
  const distance = Math.sqrt(relativePos.x ** 2 + relativePos.y ** 2 + relativePos.z ** 2)
  const fieldStrength = (magnet.remanence / (distance * distance + 0.1)) * 1000
  
  return (
    <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700 min-w-[200px]">
      <h3 className="text-sm font-semibold mb-3">传感器位置场强</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">总场强</span>
          <span className="font-mono font-semibold">{fieldStrength.toFixed(1)} mT</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">距离</span>
          <span className="font-mono">{distance.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">状态</span>
          <span className={`font-medium ${fieldStrength > 20 ? 'text-green-400' : 'text-amber-400'}`}>
            {fieldStrength > 20 ? '✓ 正常' : '⚠ 偏低'}
          </span>
        </div>
      </div>
      
      {fieldStrength < 20 && (
        <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-400">
          建议：减小气隙或更换更强磁铁
        </div>
      )}
    </div>
  )
}
