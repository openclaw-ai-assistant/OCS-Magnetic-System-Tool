'use client'

import { useState, useEffect } from 'react'
import { useToolStore } from '@/store/toolStore'
import { runSimulation } from '@/lib/simulation/magnetic-field'
import { runOptimization } from '@/lib/simulation/optimizer'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Play, Pause, RotateCcw, Check, TrendingDown, Target, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface OptimizationStepProps {
  onComplete: () => void
}

export default function OptimizationStep({ onComplete }: OptimizationStepProps) {
  const { configuration, setConfiguration, setSimulationResult, simulationResult } = useToolStore()
  
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [optimizationResults, setOptimizationResults] = useState<any[]>([])
  const [bestConfig, setBestConfig] = useState<any>(null)
  const [originalResult, setOriginalResult] = useState<any>(null)
  const [optimizationType, setOptimizationType] = useState<'airgap' | 'position' | 'full'>('airgap')
  const [targetMetric, setTargetMetric] = useState<'maxError' | 'avgError'>('maxError')

  const startOptimization = async () => {
    if (!configuration.sensor || !configuration.magnet) {
      toast.error('请先选择传感器和磁铁')
      return
    }

    setIsOptimizing(true)
    setProgress(0)
    setOptimizationResults([])

    try {
      // 保存原始结果
      const original = await runSimulation(configuration)
      setOriginalResult(original)

      // 运行优化
      const results = await runOptimization(
        configuration,
        optimizationType,
        targetMetric,
        (p, currentResult) => {
          setProgress(p)
          if (currentResult) {
            setOptimizationResults(prev => [...prev, currentResult])
          }
        }
      )

      setBestConfig(results.best)
      
      // 应用最佳配置
      setConfiguration(results.best.configuration)
      setSimulationResult(results.best.result)
      
      toast.success(`优化完成！${targetMetric === 'maxError' ? '最大误差' : '平均误差'}从 ${results.original.toFixed(2)}° 降低到 ${results.best.result[targetMetric].toFixed(2)}°`)
    } catch (error) {
      toast.error('优化失败')
      console.error(error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const applyBestConfig = () => {
    if (bestConfig) {
      setConfiguration(bestConfig.configuration)
      setSimulationResult(bestConfig.result)
      onComplete()
    }
  }

  const improvement = bestConfig && originalResult
    ? ((originalResult[targetMetric] - bestConfig.result[targetMetric]) / originalResult[targetMetric] * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <TrendingDown className="text-green-500" />
          自动优化
        </h2>
        <p className="text-slate-400">扫描参数空间，寻找最佳配置</p>
      </div>

      {/* Optimization Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-4">优化设置</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">优化参数</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'airgap', label: '气隙优化', desc: '扫描最佳气隙' },
                { id: 'position', label: '位置优化', desc: 'XY位置微调' },
                { id: 'full', label: '全面优化', desc: '所有参数' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setOptimizationType(opt.id as any)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    optimizationType === opt.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-slate-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-2">优化目标</label>
            <div className="flex gap-2">
              {[
                { id: 'maxError', label: '最小化最大误差' },
                { id: 'avgError', label: '最小化平均误差' },
              ].map((target) => (
                <button
                  key={target.id}
                  onClick={() => setTargetMetric(target.id as any)}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    targetMetric === target.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {target.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      {!bestConfig && (
        <button
          onClick={startOptimization}
          disabled={isOptimizing}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 rounded-xl transition-all font-semibold text-lg"
        >
          {isOptimizing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              优化中... {progress.toFixed(0)}%
            </>
          ) : (
            <>
              <Target size={24} />
              开始自动优化
            </>
          )}
        </button>
      )}

      {/* Progress */}
      {isOptimizing && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">优化进度</span>
            <span className="text-sm font-mono">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            正在扫描 {optimizationType === 'airgap' ? '气隙范围' : optimizationType === 'position' ? 'XY位置' : '所有参数'}...
          </p>
        </div>
      )}

      {/* Real-time Chart */}
      {optimizationResults.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold mb-4">优化过程</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={optimizationResults.map((r, i) => ({
                iteration: i + 1,
                error: r.error,
                best: r.bestError
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="iteration" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="error"
                  stroke="#64748b"
                  strokeWidth={1}
                  dot={false}
                  name="当前误差"
                />
                <Line
                  type="monotone"
                  dataKey="best"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="最佳误差"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Results */}
      {bestConfig && originalResult && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-green-400">优化完成！</h3>
              <p className="text-sm text-slate-400">找到最佳配置</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">原始误差</div>
              <div className="text-xl font-bold text-slate-400">
                {originalResult[targetMetric].toFixed(2)}°
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">优化后</div>
              <div className="text-xl font-bold text-green-400">
                {bestConfig.result[targetMetric].toFixed(2)}°
              </div>
            </div>
          </div>

          <div className="bg-green-500/20 rounded-lg p-3 mb-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-green-400">↓{improvement}%</span>
              <div className="text-sm text-slate-400 mt-1">误差降低</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400">最佳气隙</span>
              <span className="font-mono">{bestConfig.configuration.params.airGap.toFixed(2)} mm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-slate-400">传感器位置</span>
              <span className="font-mono">
                ({bestConfig.configuration.sensorPosition.position.x.toFixed(1)}, 
                 {bestConfig.configuration.sensorPosition.position.y.toFixed(1)}, 
                 {bestConfig.configuration.sensorPosition.position.z.toFixed(1)}) mm
              </span>
            </div>
          </div>

          <button
            onClick={applyBestConfig}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors font-medium"
          >
            应用优化配置并查看结果
            <ChevronRight size={20} />
          </button>

          <button
            onClick={() => {
              setBestConfig(null)
              setOriginalResult(null)
              setOptimizationResults([])
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            重新优化
          </button>
        </div>
      )}
    </div>
  )
}
