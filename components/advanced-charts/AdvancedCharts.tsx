'use client'

import { useMemo } from 'react'
import { useToolStore } from '@/store/toolStore'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Area, AreaChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from 'recharts'
import { Activity, Thermometer, Clock, Zap, TrendingUp } from 'lucide-react'

interface AdvancedChartsProps {
  onClose?: () => void
}

export default function AdvancedCharts({ onClose }: AdvancedChartsProps) {
  const { simulationResult, configuration } = useToolStore()

  if (!simulationResult) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Activity size={48} className="mx-auto mb-4 opacity-50" />
        <p>请先运行仿真以查看高级图表</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <TrendingUp className="text-purple-400" />
            高级图表分析
          </h2>
          <p className="text-slate-400">深度数据分析与可视化</p>
        </div>
      </div>

      {/* FFT频谱分析 */}
      <FFTAnalysis simulationResult={simulationResult} />

      {/* 误差傅里叶分解 */}
      <ErrorFourierAnalysis simulationResult={simulationResult} />

      {/* 温度漂移曲线 */}
      <TemperatureDriftCurve configuration={configuration} />

      {/* 寿命预测模型 */}
      <LifetimePrediction configuration={configuration} />
    </div>
  )
}

// FFT频谱分析
function FFTAnalysis({ simulationResult }: { simulationResult: any }) {
  const fftData = useMemo(() => {
    // 简化的FFT计算 - 实际应用中应该使用真正的FFT库
    const errors = simulationResult.angleError
    const n = errors.length
    const fft = []
    
    // 计算前20个谐波
    for (let k = 1; k <= 20; k++) {
      let real = 0
      let imag = 0
      
      for (let i = 0; i < n; i++) {
        const angle = -2 * Math.PI * k * i / n
        real += errors[i] * Math.cos(angle)
        imag += errors[i] * Math.sin(angle)
      }
      
      const magnitude = Math.sqrt(real * real + imag * imag) / n
      fft.push({
        harmonic: k,
        magnitude: magnitude * 1000, // 转换为微度
        frequency: `H${k}`
      })
    }
    
    return fft
  }, [simulationResult])

  // 找出主要谐波
  const dominantHarmonics = useMemo(() => {
    return [...fftData]
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 3)
  }, [fftData])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-yellow-400" />
        <h3 className="font-semibold">FFT 频谱分析</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 频谱图 */}
        <div className="lg:col-span-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fftData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="frequency" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value: any) => [`${value.toFixed(2)} μ°`, '幅度']}
              />
              <Bar dataKey="magnitude" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 主要谐波信息 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-400">主要谐波成分</h4>
          {dominantHarmonics.map((h, idx) => (
            <div key={h.harmonic} className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{h.frequency}</span>
                <span className={`text-xs px-2 py-1 rounded ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>
                  {idx === 0 ? '主频' : `#${idx + 1}`}
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {h.magnitude.toFixed(1)} μ°
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        FFT分析显示角度误差的频谱成分，帮助识别周期性误差源
      </p>
    </div>
  )
}

// 误差傅里叶分解
function ErrorFourierAnalysis({ simulationResult }: { simulationResult: any }) {
  const fourierData = useMemo(() => {
    const errors = simulationResult.angleError
    const n = errors.length
    
    // 计算各阶谐波
    const harmonics = []
    for (let order = 1; order <= 10; order++) {
      let sinCoeff = 0
      let cosCoeff = 0
      
      for (let i = 0; i < n; i++) {
        const angle = 2 * Math.PI * i / n
        sinCoeff += errors[i] * Math.sin(order * angle)
        cosCoeff += errors[i] * Math.cos(order * angle)
      }
      
      sinCoeff *= 2 / n
      cosCoeff *= 2 / n
      
      const amplitude = Math.sqrt(sinCoeff * sinCoeff + cosCoeff * cosCoeff)
      const phase = Math.atan2(sinCoeff, cosCoeff) * 180 / Math.PI
      
      harmonics.push({
        order: `${order}次`,
        amplitude: amplitude * 1000, // 转换为微度
        phase: phase,
        sinCoeff: sinCoeff * 1000,
        cosCoeff: cosCoeff * 1000
      })
    }
    
    return harmonics
  }, [simulationResult])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-cyan-400" />
        <h3 className="font-semibold">误差傅里叶分解</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 幅度图 */}
        <div className="h-64">
          <h4 className="text-sm text-slate-400 mb-2">谐波幅度</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fourierData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="order" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value: any) => [`${value.toFixed(2)} μ°`, '幅度']}
              />
              <Bar dataKey="amplitude" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 相位图 */}
        <div className="h-64">
          <h4 className="text-sm text-slate-400 mb-2">谐波相位</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fourierData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="order" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[-180, 180]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value: any) => [`${value.toFixed(1)}°`, '相位']}
              />
              <Bar dataKey="phase" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// 温度漂移曲线
function TemperatureDriftCurve({ configuration }: { configuration: any }) {
  const tempData = useMemo(() => {
    const data = []
    const sensor = configuration.sensor
    const baseTemp = 25
    
    // 模拟温度漂移 (-40°C 到 125°C)
    for (let temp = -40; temp <= 125; temp += 5) {
      // 简化的温度漂移模型
      const drift = (temp - baseTemp) * 0.01 // 假设 0.01°/°C 漂移
      const maxError = 0.5 + Math.abs(drift)
      const accuracy = sensor?.specs?.accuracy ? parseFloat(sensor.specs.accuracy.replace('±', '').replace('°', '')) : 0.5
      
      data.push({
        temperature: temp,
        maxError: maxError,
        accuracy: accuracy,
        drift: drift
      })
    }
    
    return data
  }, [configuration])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer size={20} className="text-red-400" />
        <h3 className="font-semibold">温度漂移分析</h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="temperature" 
              stroke="#64748b"
              label={{ value: '温度 (°C)', position: 'bottom' }}
            />
            <YAxis 
              stroke="#64748b"
              label={{ value: '误差 (°)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="maxError" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.2}
              name="最大误差"
            />
            <Area 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#22c55e" 
              fill="#22c55e" 
              fillOpacity={0.1}
              name="标称精度"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">-40°C 误差</div>
          <div className="text-lg font-bold text-blue-400">
            {tempData[0].maxError.toFixed(2)}°
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">25°C 误差</div>
          <div className="text-lg font-bold text-green-400">
            {tempData.find(d => d.temperature === 25)?.maxError.toFixed(2)}°
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500">125°C 误差</div>
          <div className="text-lg font-bold text-red-400">
            {tempData[tempData.length - 1].maxError.toFixed(2)}°
          </div>
        </div>
      </div>
    </div>
  )
}

// 寿命预测模型
function LifetimePrediction({ configuration }: { configuration: any }) {
  const lifetimeData = useMemo(() => {
    const data = []
    const magnet = configuration.magnet
    const temp = configuration.params.temperature
    
    // 基础寿命（小时）
    const baseLifetime = 50000
    
    // 温度加速因子
    const tempFactor = temp > 25 ? Math.exp((temp - 25) / 10) : 1
    
    // 材料因子
    const materialFactors: Record<string, number> = {
      'ndfeb': 1.0,
      'smco': 0.3,  // 更稳定
      'alnico': 0.5,
      'ferrite': 0.2
    }
    const materialFactor = materialFactors[magnet?.material as string] || 1.0
    
    // 计算每年的性能衰减
    for (let year = 0; year <= 20; year++) {
      const degradation = 1 - (year * 0.01 * tempFactor * materialFactor)
      const fieldStrength = (magnet?.remanence || 1.0) * degradation
      
      data.push({
        year: year,
        fieldStrength: fieldStrength * 1000, // mT
        degradation: degradation * 100, // %
        status: degradation > 0.8 ? '正常' : degradation > 0.6 ? '注意' : '更换'
      })
    }
    
    return data
  }, [configuration])

  const estimatedLife = useMemo(() => {
    return lifetimeData.find(d => d.degradation < 80)?.year || 20
  }, [lifetimeData])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-green-400" />
        <h3 className="font-semibold">寿命预测模型</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 寿命曲线 */}
        <div className="lg:col-span-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lifetimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
                label={{ value: '年限', position: 'bottom' }}
              />
              <YAxis 
                stroke="#64748b"
                label={{ value: '剩磁 (mT)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
              <Area 
                type="monotone" 
                dataKey="fieldStrength" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.2}
                name="剩磁强度"
              />
              {/* 80% 阈值线 */}
              <Line 
                type="monotone" 
                dataKey={() => lifetimeData[0]?.fieldStrength * 0.8} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                dot={false}
                name="更换阈值 (80%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 预测信息 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-sm text-green-400 mb-1">预计使用寿命</div>
            <div className="text-3xl font-bold">{estimatedLife} 年</div>
            <div className="text-xs text-slate-400 mt-1">
              基于当前工作温度 {configuration.params.temperature}°C
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-400">影响因素</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">工作温度</span>
                <span className={configuration.params.temperature > 80 ? 'text-red-400' : 'text-slate-300'}>
                  {configuration.params.temperature}°C {configuration.params.temperature > 80 && '(高)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">磁铁材料</span>
                <span className="text-slate-300 uppercase">{configuration.magnet?.material || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">年衰减率</span>
                <span className="text-slate-300">~1%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-400">
              💡 建议在剩磁降至80%以下时更换磁铁，以保证测量精度
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
