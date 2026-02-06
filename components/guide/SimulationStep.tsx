'use client'

import { useToolStore } from '@/store/toolStore'
import { runSimulation } from '@/lib/simulation/magnetic-field'
import { Play, Settings, AlertCircle, Check, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface SimulationStepProps {
  onComplete: () => void
}

export default function SimulationStep({ onComplete }: SimulationStepProps) {
  const {
    configuration,
    setIsSimulating,
    setSimulationProgress,
    setSimulationResult,
    isSimulating,
    simulationResult,
  } = useToolStore()

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleRunSimulation = async () => {
    if (!configuration.sensor || !configuration.magnet) {
      toast.error('请先选择传感器和磁铁')
      return
    }

    setIsSimulating(true)
    setSimulationProgress(0)

    try {
      const result = await runSimulation(
        configuration,
        (progress) => setSimulationProgress(progress)
      )

      setSimulationResult(result)
      toast.success('仿真完成！')
    } catch (error) {
      toast.error('仿真失败，请重试')
      console.error(error)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">运行仿真</h2>
        <p className="text-slate-400">执行磁场计算和误差分析</p>
      </div>

      {/* Configuration Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Check size={18} className="text-green-500" />
          配置确认
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-400">传感器</span>
            <span className="font-medium">{configuration.sensor?.name || '未选择'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-400">磁铁</span>
            <span className="font-medium">{configuration.magnet?.name || '未选择'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-slate-400">传感器位置</span>
            <span className="font-mono text-slate-300">
              ({configuration.sensorPosition.position.x.toFixed(1)},{' '}
              {configuration.sensorPosition.position.y.toFixed(1)},{' '}
              {configuration.sensorPosition.position.z.toFixed(1)}) mm
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">气隙</span>
            <span className="font-medium">{configuration.params.airGap} mm</span>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-slate-400" />
            <span className="font-medium">高级设置</span>
          </div>
          <span className="text-slate-400">{showAdvanced ? '收起' : '展开'}</span>
        </button>

        {showAdvanced && (
          <div className="p-4 border-t border-slate-700 space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">扫描分辨率</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>快速</span>
                <span>标准</span>
                <span>高精度</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">考虑温度影响</span>
              <button className="w-12 h-6 bg-slate-700 rounded-full relative">
                <div className="w-4 h-4 bg-slate-400 rounded-full absolute top-1 left-1"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">计算磁场分布</span>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Run Button */}
      {!simulationResult && (
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-semibold text-lg"
        >
          {isSimulating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              仿真中...
            </>
          ) : (
            <>
              <Play size={24} fill="currentColor" />
              开始仿真
            </>
          )}
        </button>
      )}

      {/* Progress */}
      {isSimulating && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">计算进度</span>
            <span className="text-sm font-mono">
              {useToolStore.getState().simulationProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${useToolStore.getState().simulationProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            正在计算磁场分布和角度误差，请稍候...
          </p>
        </div>
      )}

      {/* Success State */}
      {simulationResult && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-green-400">仿真完成</h3>
              <p className="text-sm text-slate-400">所有计算已完成</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {simulationResult.maxError.toFixed(2)}°
              </div>
              <div className="text-xs text-slate-500">最大角度误差</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">
                {simulationResult.avgError.toFixed(2)}°
              </div>
              <div className="text-xs text-slate-500">平均角度误差</div>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors font-medium"
          >
            查看详细结果
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Warning */}
      {!configuration.sensor || !configuration.magnet ? (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300">
            <p className="font-medium text-orange-400 mb-1">配置不完整</p>
            <p>请先完成传感器和磁铁的选择</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
