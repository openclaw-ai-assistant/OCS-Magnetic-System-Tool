'use client'

import { useToolStore } from '@/store/toolStore'
import { Move3d, Rotate3d, Info, ChevronRight } from 'lucide-react'

interface PositionStepProps {
  onComplete: () => void
}

export default function PositionStep({ onComplete }: PositionStepProps) {
  const { configuration, updateSensorPosition, updateMagnetPosition } = useToolStore()
  const sensorPos = configuration.sensorPosition
  const magnetPos = configuration.magnetPosition

  const AxisControl = ({
    label,
    value,
    onChange,
    step = 0.1,
    min = -50,
    max = 50,
  }: {
    label: string
    value: number
    onChange: (val: number) => void
    step?: number
    min?: number
    max?: number
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-4 font-mono uppercase">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <input
        type="number"
        value={value.toFixed(1)}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center font-mono"
        step={step}
      />
      <span className="text-xs text-slate-500 w-8">mm</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">配置位置</h2>
        <p className="text-slate-400">调整传感器和磁铁的相对位置</p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <p>调整位置和旋转角度以优化磁场测量。右侧3D视图会实时更新。</p>
        </div>
      </div>

      {/* Sensor Position */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Move3d size={20} className="text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold">传感器位置</h3>
            <p className="text-xs text-slate-400">相对磁铁中心的位置</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-slate-300 mb-3">位置 (mm)</h4>
            <div className="space-y-3">
              <AxisControl
                label="x"
                value={sensorPos.position.x}
                onChange={(v) => updateSensorPosition({ position: { ...sensorPos.position, x: v } })}
              />
              <AxisControl
                label="y"
                value={sensorPos.position.y}
                onChange={(v) => updateSensorPosition({ position: { ...sensorPos.position, y: v } })}
              />
              <AxisControl
                label="z"
                value={sensorPos.position.z}
                onChange={(v) => updateSensorPosition({ position: { ...sensorPos.position, z: v } })}
              />
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-slate-300 mb-3">旋转 (°)</h4>
            <div className="space-y-3">
              <AxisControl
                label="x"
                value={sensorPos.rotation.x}
                onChange={(v) => updateSensorPosition({ rotation: { ...sensorPos.rotation, x: v } })}
                step={1}
                min={-180}
                max={180}
              />
              <AxisControl
                label="y"
                value={sensorPos.rotation.y}
                onChange={(v) => updateSensorPosition({ rotation: { ...sensorPos.rotation, y: v } })}
                step={1}
                min={-180}
                max={180}
              />
              <AxisControl
                label="z"
                value={sensorPos.rotation.z}
                onChange={(v) => updateSensorPosition({ rotation: { ...sensorPos.rotation, z: v } })}
                step={1}
                min={-180}
                max={180}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Magnet Position */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Rotate3d size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold">磁铁位置</h3>
            <p className="text-xs text-slate-400">调整磁铁方向和位置</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-slate-300 mb-3">位置 (mm)</h4>
            <div className="space-y-3">
              <AxisControl
                label="x"
                value={magnetPos.position.x}
                onChange={(v) => updateMagnetPosition({ position: { ...magnetPos.position, x: v } })}
              />
              <AxisControl
                label="y"
                value={magnetPos.position.y}
                onChange={(v) => updateMagnetPosition({ position: { ...magnetPos.position, y: v } })}
              />
              <AxisControl
                label="z"
                value={magnetPos.position.z}
                onChange={(v) => updateMagnetPosition({ position: { ...magnetPos.position, z: v } })}
              />
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-slate-300 mb-3">旋转 (°)</h4>
            <div className="space-y-3">
              <AxisControl
                label="x"
                value={magnetPos.rotation.x}
                onChange={(v) => updateMagnetPosition({ rotation: { ...magnetPos.rotation, x: v } })}
                step={1}
                min={-180}
                max={180}
              />
              <AxisControl
                label="y"
                value={magnetPos.rotation.y}
                onChange={(v) => updateMagnetPosition({ rotation: { ...magnetPos.rotation, y: v } })}
                step={1}
                min={-180}
                max={180}
              />
              <AxisControl
                label="z"
                value={magnetPos.rotation.z}
                onChange={(v) => updateMagnetPosition({ rotation: { ...magnetPos.rotation, z: v } })}
                step={1}
                min={-180}
                max={180}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all font-medium"
      >
        下一步：运行仿真
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
