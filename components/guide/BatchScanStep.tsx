'use client'

import { useState, useMemo } from 'react'
import { useToolStore } from '@/store/toolStore'
import { runSimulation } from '@/lib/simulation/magnetic-field'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts'
import { Scan, Play, Pause, Target, TrendingDown, Thermometer, Settings, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface BatchScanStepProps {
  onComplete: () => void
}

export default function BatchScanStep({ onComplete }: BatchScanStepProps) {
  const { configuration, setConfiguration, setSimulationResult } = useToolStore()
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanResults, setScanResults] = useState<any[]>([])
  const [bestConfig, setBestConfig] = useState<any>(null)
  
  // 扫描参数设置
  const [scanParams, setScanParams] = useState({
    paramType: 'airgap' as 'airgap' | 'temperature' | 'position',
    start: 0.5,
    end: 5.0,
    step: 0.25
  })

  // 开始扫描
  const startScan = async () => {
    if (!configuration.sensor || !configuration.magnet) {
      toast.error('请先选择传感器和磁铁')
      return
    }

    setIsScanning(true)
    setProgress(0)
    setScanResults([])
    setBestConfig(null)

    const results = []
    const steps = Math.ceil((scanParams.end - scanParams.start) / scanParams.step)
    let bestResult = null
    let minError = Infinity

    try {
      for (let i = 0; i <= steps; i++) {
        const value = scanParams.start + i * scanParams.step
        
        // 创建新配置
        let newConfig = { ...configuration }
        
        if (scanParams.paramType === 'airgap') {
          newConfig.params = { ...newConfig.params, airGap: value }
          newConfig.sensorPosition = {
            ...newConfig.sensorPosition,
            position: { ...newConfig.sensorPosition.position, z: value }
          }
        } else if (scanParams.paramType === 'temperature') {
          newConfig.params = { ...newConfig.params, temperature: value }
        } else if (scanParams.paramType === 'position') {
          newConfig.sensorPosition = {
            ...newConfig.sensorPosition,
            position: { ...newConfig.sensorPosition.position, x: value }
          }
        }

        // 运行仿真
        const result = await runSimulation(newConfig)
        
        const scanResult = {
          value: value,
          maxError: result.maxError,
          avgError: result.avgError,
          snr: result.snr,
          config: newConfig,
          result: result
        }
        
        results.push(scanResult)
        
        // 记录最佳结果
        if (result.maxError < minError) {
          minError = result.maxError
          bestResult = scanResult
        }
        
        // 更新进度
        const prog = ((i + 1) / (steps + 1)) * 100
        setProgress(prog)
        setScanResults([...results])
      }

      setBestConfig(bestResult)
      if (bestResult) {
        toast.success(`扫描完成！找到最佳${scanParams.paramType === 'airgap' ? '气隙' : '参数'}: ${bestResult.value.toFixed(2)}`)
      }
    } catch (error) {
      toast.error('扫描失败')
      console.error(error)
    } finally {
      setIsScanning(false)
    }
  }

  // 应用最佳配置
  const applyBestConfig = () => {
    if (bestConfig) {
      setConfiguration(bestConfig.config)
      setSimulationResult(bestConfig.result)
      toast.success('已应用最佳配置')
      onComplete()
    }
  }

  // 获取参数名称
  const getParamName = () => {
    switch (scanParams.paramType) {
      case 'airgap': return '气隙 (mm)'
      case 'temperature': return '温度 (°C)'
      case 'position': return '位置 X (mm)'
      default: return '参数'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Scan className="text-purple-400" />
          批量参数扫描
        </h2>
        <p className="text-slate-400">扫描参数空间，寻找全局最优配置</p>
      </div>

      {/* 扫描设置 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings size={18} className="text-blue-400" />
          扫描参数设置
        </h3>
        
        <div className="space-y-4">
          {/* 参数类型 */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">扫描参数</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'airgap', label: '气隙', icon: Target, desc: '0.5 - 5 mm' },
                { id: 'temperature', label: '温度', icon: Thermometer, desc: '-40 - 125 °C' },
                { id: 'position', label: '位置X', icon: TrendingDown, desc: '-2 - 2 mm' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setScanParams({...scanParams, paramType: type.id as any})
                    // 设置默认范围
                    if (type.id === 'airgap') {
                      setScanParams({paramType: 'airgap', start: 0.5, end: 5.0, step: 0.25})
                    } else if (type.id === 'temperature') {
                      setScanParams({paramType: 'temperature', start: -40, end: 125, step: 10})
                    } else {
                      setScanParams({paramType: 'position', start: -2, end: 2, step: 0.2})
                    }
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    scanParams.paramType === type.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <type.icon size={18} className="mb-1" />
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-slate-500">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 范围设置 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">起始值</label>
              <input
                type="number"
                value={scanParams.start}
                onChange={(e) => setScanParams({...scanParams, start: parseFloat(e.target.value)})}
                step={scanParams.step}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">结束值</label>
              <input
                type="number"
                value={scanParams.end}
                onChange={(e) => setScanParams({...scanParams, end: parseFloat(e.target.value)})}
                step={scanParams.step}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">步进</label>
              <input
                type="number"
                value={scanParams.step}
                onChange={(e) => setScanParams({...scanParams, step: parseFloat(e.target.value)})}
                min={0.01}
                step={0.01}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 预估扫描点数 */}
          <div className="text-sm text-slate-400">
            预估扫描点数: {Math.ceil((scanParams.end - scanParams.start) / scanParams.step) + 1} 个配置
          </div>
        </div>
      </div>

      {/* 开始扫描按钮 */}
      {!scanResults.length && (
        <button
          onClick={startScan}
          disabled={isScanning}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 rounded-xl transition-all font-semibold text-lg"
        >
          {isScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              扫描中... {progress.toFixed(0)}%
            </>
          ) : (
            <>
              <Play size={24} />
              开始参数扫描
            </>
          )}
        </button>
      )}

      {/* 扫描进度 */}
      {isScanning && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">扫描进度</span>
            <span className="text-sm font-mono">{scanResults.length} / {Math.ceil((scanParams.end - scanParams.start) / scanParams.step) + 1}</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 扫描结果图表 */}
      {scanResults.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold mb-4">扫描结果</h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scanResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="value" 
                  stroke="#64748b"
                  label={{ value: getParamName(), position: 'bottom' }}
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'maxError') return [`${value.toFixed(3)}°`, '最大误差']
                    if (name === 'avgError') return [`${value.toFixed(3)}°`, '平均误差']
                    return [value, name]
                  }}
                  labelFormatter={(value: any) => `${getParamName()}: ${value}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="maxError" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="最大误差"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgError" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="平均误差"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* SNR曲线 */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scanResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="value" 
                  stroke="#64748b"
                  label={{ value: getParamName(), position: 'bottom' }}
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="snr" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="信噪比 (dB)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 最佳结果 */}
      {bestConfig && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-green-400">扫描完成！找到最佳配置</h3>
              <p className="text-sm text-slate-400">
                最佳{scanParams.paramType === 'airgap' ? '气隙' : '参数'}: {bestConfig.value.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-500">最大误差</div>
              <div className="text-xl font-bold text-green-400">
                {bestConfig.maxError.toFixed(3)}°
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-500">信噪比</div>
              <div className="text-xl font-bold text-blue-400">
                {bestConfig.snr.toFixed(1)} dB
              </div>
            </div>
          </div>

          <button
            onClick={applyBestConfig}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors font-medium"
          >
            应用最佳配置
          </button>
        </div>
      )}
    </div>
  )
}
