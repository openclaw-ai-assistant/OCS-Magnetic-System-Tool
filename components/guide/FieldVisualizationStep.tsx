'use client'

import { useToolStore } from '@/store/toolStore'
import MagneticField3D from '@/components/visualization/MagneticField3D'
import { Magnet, Move3d, ChevronRight, Info } from 'lucide-react'

interface FieldVisualizationStepProps {
  onComplete: () => void
}

export default function FieldVisualizationStep({ onComplete }: FieldVisualizationStepProps) {
  const { configuration, showFieldLines, showFieldVectors, showHeatmap, toggleFieldLines, toggleFieldVectors, toggleHeatmap } = useToolStore()
  const { sensor, magnet, sensorPosition, magnetPosition } = configuration

  // 计算传感器位置的场强
  const calculateFieldStrength = () => {
    if (!sensor || !magnet) return 0
    
    const dx = sensorPosition.position.x - magnetPosition.position.x
    const dy = sensorPosition.position.y - magnetPosition.position.y
    const dz = sensorPosition.position.z - magnetPosition.position.z
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
    
    // 简化的场强计算
    return (magnet.remanence / (distance * distance + 0.1)) * 1000
  }

  const fieldStrength = calculateFieldStrength()
  
  // 判断场强是否合适
  const getFieldStatus = () => {
    if (fieldStrength > 80) return { text: '强', color: 'text-red-400', bg: 'bg-red-500/20', icon: '🔴' }
    if (fieldStrength > 40) return { text: '良好', color: 'text-green-400', bg: 'bg-green-500/20', icon: '🟢' }
    if (fieldStrength > 20) return { text: '中等', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: '🟡' }
    return { text: '弱', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '🔵' }
  }

  const status = getFieldStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Magnet className="text-cyan-400" />
          磁场可视化
        </h2>
        <p className="text-slate-400">查看3D磁场分布和传感器位置场强</p>
      </div>

      {/* 配置状态 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Move3d size={18} className="text-blue-400" />
          当前配置
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">传感器位置</div>
            <div className="font-mono text-sm">
              ({sensorPosition.position.x.toFixed(1)}, {sensorPosition.position.y.toFixed(1)}, {sensorPosition.position.z.toFixed(1)}) mm
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">磁铁位置</div>
            <div className="font-mono text-sm">
              ({magnetPosition.position.x.toFixed(1)}, {magnetPosition.position.y.toFixed(1)}, {magnetPosition.position.z.toFixed(1)}) mm
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">气隙</div>
          <div className="font-mono text-lg">{configuration.params.airGap.toFixed(1)} mm</div>
        </div>
      </div>

      {/* 场强信息 */}
      {sensor && magnet && (
        <div className={`${status.bg} border border-slate-700 rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">传感器位置场强</h3>
            <span className="text-2xl">{status.icon}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-3xl font-bold ${status.color}`}>
                {fieldStrength.toFixed(1)} mT
              </div>
              <div className="text-xs text-slate-400 mt-1">磁场强度</div>
            </div>
            <div>
              <div className={`text-xl font-bold ${status.color}`}>
                {status.text}
              </div>
              <div className="text-xs text-slate-400 mt-1">状态评估</div>
            </div>
          </div>

          {fieldStrength < 20 && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-400">
                  <p className="font-medium">磁场强度偏低</p>
                  <p className="text-xs mt-1">建议：减小气隙、使用更强磁铁，或调整传感器位置</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 可视化控制 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-3">显示选项</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={toggleFieldLines}
            className={`p-3 rounded-lg border-2 transition-all ${
              showFieldLines 
                ? 'border-cyan-500 bg-cyan-500/10' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-1">〰️</div>
            <div className="text-xs">磁力线</div>
          </button>
          <button
            onClick={toggleFieldVectors}
            className={`p-3 rounded-lg border-2 transition-all ${
              showFieldVectors 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-1">➡️</div>
            <div className="text-xs">场向量</div>
          </button>
          <button
            onClick={toggleHeatmap}
            className={`p-3 rounded-lg border-2 transition-all ${
              showHeatmap 
                ? 'border-orange-500 bg-orange-500/10' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs">热力图</div>
          </button>
        </div>
      </div>

      {/* 图例说明 */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-slate-400 mb-2">场强图例</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-slate-400">强 (&gt;80 mT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-slate-400">良好 (40-80 mT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-400">中等 (20-40 mT)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-400">弱 (&lt;20 mT)</span>
          </div>
        </div>
      </div>

      {/* 继续按钮 */}
      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all font-semibold"
      >
        继续到仿真
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
