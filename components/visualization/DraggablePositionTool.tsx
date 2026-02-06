'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Cylinder, Torus, Text } from '@react-three/drei'
import { useToolStore } from '@/store/toolStore'
import * as THREE from 'three'
import { Move, MousePointer2, Info } from 'lucide-react'

// 可拖拽的传感器组件
function DraggableSensor({ position, onPositionChange, name }: { 
  position: { x: number; y: number; z: number }
  onPositionChange: (pos: { x: number; y: number; z: number }) => void
  name: string
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { camera, gl, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const dragPlane = useRef(new THREE.Plane())
  const dragOffset = useRef(new THREE.Vector3())

  const pos: [number, number, number] = [position.x / 5, position.y / 5 + 0.5, position.z / 5]

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!meshRef.current) return
      
      // 计算鼠标位置
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      // 射线检测
      raycaster.current.setFromCamera(mouse.current, camera)
      const intersects = raycaster.current.intersectObject(meshRef.current, true)
      
      if (intersects.length > 0) {
        setIsDragging(true)
        
        // 创建拖拽平面（垂直于相机）
        const normal = new THREE.Vector3(0, 1, 0)
        dragPlane.current.setFromNormalAndCoplanarPoint(normal, intersects[0].point)
        
        // 计算偏移
        dragOffset.current.copy(intersects[0].point).sub(meshRef.current.position)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !meshRef.current) return
      
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.current.setFromCamera(mouse.current, camera)
      const targetPoint = new THREE.Vector3()
      raycaster.current.ray.intersectPlane(dragPlane.current, targetPoint)
      
      if (targetPoint) {
        const newPos = targetPoint.sub(dragOffset.current)
        // 转换回原始坐标系（放大5倍，y偏移0.5）
        onPositionChange({
          x: newPos.x * 5,
          y: (newPos.y - 0.5) * 5,
          z: newPos.z * 5
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, camera, gl, onPositionChange])

  return (
    <group 
      ref={meshRef} 
      position={pos}
      scale={isDragging ? 1.1 : 1}
    >
      {/* 传感器主体 */}
      <Box args={[1.2, 0.2, 1.2]}>
        <meshStandardMaterial 
          color={isDragging ? '#22d3ee' : '#3b82f6'} 
          metalness={0.6} 
          roughness={0.3} 
          emissive={isDragging ? '#22d3ee' : '#000000'}
          emissiveIntensity={isDragging ? 0.3 : 0}
        />
      </Box>
      
      {/* 感应区域 */}
      <Cylinder args={[0.3, 0.3, 0.05, 32]} position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.5} />
      </Cylinder>

      {/* 拖拽指示器 */}
      {isDragging && (
        <>
          {/* 拖拽平面指示 */}
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2, 32]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.1} />
          </mesh>
          {/* 十字准星 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([-2, 0, 0, 2, 0, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#22d3ee" />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, -2, 0, 0, 2])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#22d3ee" />
          </line>
        </>
      )}

      {/* 标签 */}
      <Text position={[0, 0.5, 0]} fontSize={0.25} color="#22d3ee" anchorX="center">
        {name}
      </Text>
      
      {/* 坐标显示 */}
      {isDragging && (
        <Text 
          position={[0, 0.8, 0]} 
          fontSize={0.2} 
          color="#ffffff" 
          anchorX="center"
        >
          ({position.x.toFixed(1)}, {position.y.toFixed(1)}, {position.z.toFixed(1)}) mm
        </Text>
      )}
    </group>
  )
}

// 主组件
export default function DraggablePositionTool() {
  const { configuration, updateSensorPosition, updateMagnetPosition } = useToolStore()
  const [activeMode, setActiveMode] = useState<'sensor' | 'magnet'>('sensor')
  const [showHelp, setShowHelp] = useState(true)

  const handleSensorPositionChange = (pos: { x: number; y: number; z: number }) => {
    updateSensorPosition({ position: pos })
  }

  const handleMagnetPositionChange = (pos: { x: number; y: number; z: number }) => {
    updateMagnetPosition({ position: pos })
  }

  return (
    <div className="relative w-full h-full bg-slate-950">
      {/* 控制面板 */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700 max-w-xs">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Move size={18} className="text-blue-400" />
          拖拽调整位置
        </h3>
        
        {/* 模式选择 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveMode('sensor')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              activeMode === 'sensor'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            传感器
          </button>
          <button
            onClick={() => setActiveMode('magnet')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              activeMode === 'magnet'
                ? 'bg-red-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            磁铁
          </button>
        </div>

        {/* 当前位置显示 */}
        <div className="space-y-2 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-2">
            <div className="text-slate-500 text-xs mb-1">传感器位置</div>
            <div className="font-mono">
              ({configuration.sensorPosition.position.x.toFixed(1)}, 
               {configuration.sensorPosition.position.y.toFixed(1)}, 
               {configuration.sensorPosition.position.z.toFixed(1)}) mm
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2">
            <div className="text-slate-500 text-xs mb-1">磁铁位置</div>
            <div className="font-mono">
              ({configuration.magnetPosition.position.x.toFixed(1)}, 
               {configuration.magnetPosition.position.y.toFixed(1)}, 
               {configuration.magnetPosition.position.z.toFixed(1)}) mm
            </div>
          </div>
        </div>

        {/* 气隙显示 */}
        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-xs text-blue-400">当前气隙</div>
          <div className="text-xl font-bold text-blue-400">
            {configuration.params.airGap.toFixed(2)} mm
          </div>
        </div>
      </div>

      {/* 帮助提示 */}
      {showHelp && (
        <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-slate-700 max-w-xs">
          <div className="flex items-start gap-2">
            <MousePointer2 size={18} className="text-slate-400 mt-0.5" />
            <div className="text-sm text-slate-400">
              <p className="font-medium text-white mb-1">操作说明</p>
              <p>1. 点击选择传感器或磁铁</p>
              <p>2. 在3D视图中拖拽移动</p>
              <p>3. 实时查看位置变化</p>
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="text-slate-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* 网格 */}
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

        {/* 可拖拽传感器 */}
        {configuration.sensor && (
          <DraggableSensor
            position={configuration.sensorPosition.position}
            onPositionChange={handleSensorPositionChange}
            name={configuration.sensor.name}
          />
        )}

        {/* 可拖拽磁铁 */}
        {configuration.magnet && (
          <DraggableMagnet
            position={configuration.magnetPosition.position}
            onPositionChange={handleMagnetPositionChange}
            magnet={configuration.magnet}
          />
        )}

        {/* 控制器 */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  )
}

// 可拖拽的磁铁组件
function DraggableMagnet({ position, onPositionChange, magnet }: { 
  position: { x: number; y: number; z: number }
  onPositionChange: (pos: { x: number; y: number; z: number }) => void
  magnet: any
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { camera, gl } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const dragPlane = useRef(new THREE.Plane())
  const dragOffset = useRef(new THREE.Vector3())

  const pos: [number, number, number] = [position.x / 5, position.y / 5, position.z / 5]
  const dims = magnet.dimensions

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!meshRef.current) return
      
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.current.setFromCamera(mouse.current, camera)
      const intersects = raycaster.current.intersectObject(meshRef.current, true)
      
      if (intersects.length > 0) {
        setIsDragging(true)
        const normal = new THREE.Vector3(0, 1, 0)
        dragPlane.current.setFromNormalAndCoplanarPoint(normal, intersects[0].point)
        dragOffset.current.copy(intersects[0].point).sub(meshRef.current.position)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !meshRef.current) return
      
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.current.setFromCamera(mouse.current, camera)
      const targetPoint = new THREE.Vector3()
      raycaster.current.ray.intersectPlane(dragPlane.current, targetPoint)
      
      if (targetPoint) {
        const newPos = targetPoint.sub(dragOffset.current)
        onPositionChange({
          x: newPos.x * 5,
          y: newPos.y * 5,
          z: newPos.z * 5
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, camera, gl, onPositionChange])

  const scale = 0.2

  return (
    <group 
      ref={meshRef} 
      position={pos}
      scale={isDragging ? 1.1 : 1}
    >
      {magnet.shape === 'cylinder' && (
        <Cylinder
          args={[(dims.diameter || 6) * scale, (dims.diameter || 6) * scale, (dims.height || 3) * scale, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial 
            color={isDragging ? '#fca5a5' : '#dc2626'} 
            metalness={0.5} 
            roughness={0.3}
            emissive={isDragging ? '#ef4444' : '#000000'}
            emissiveIntensity={isDragging ? 0.3 : 0}
          />
        </Cylinder>
      )}

      {magnet.shape === 'ring' && (
        <Torus
          args={[((dims.outerDiameter || 15) + (dims.innerDiameter || 8)) / 2 * scale, 
                 ((dims.outerDiameter || 15) - (dims.innerDiameter || 8)) / 2 * scale, 
                 16, 100]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial 
            color={isDragging ? '#fca5a5' : '#dc2626'} 
            metalness={0.5} 
            roughness={0.3}
            emissive={isDragging ? '#ef4444' : '#000000'}
            emissiveIntensity={isDragging ? 0.3 : 0}
          />
        </Torus>
      )}

      <Text position={[0, (dims.height || 3) * scale / 2 + 0.3, 0]} fontSize={0.2} color="#fca5a5" anchorX="center">
        {magnet.name}
      </Text>

      {isDragging && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  )
}
