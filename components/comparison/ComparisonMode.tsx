'use client'

import { useState } from 'react'
import { useToolStore } from '@/store/toolStore'
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, LineChart, Line, Cell
} from 'recharts'
import { GitCompare, Plus, Trash2, Download, Target, DollarSign, Zap, Award } from 'lucide-react'
import { runSimulation } from '@/lib/simulation/magnetic-field'
import toast from 'react-hot-toast'

// 对比配置项
interface ComparisonItem {
  id: string
  name: string
  configuration: any
  result: any
  color: string
}

export default function ComparisonMode() {
  const { configuration, comparisonConfigs, addComparisonConfig, removeComparisonConfig, clearComparisonConfigs } = useToolStore()
  const [isComparing, setIsComparing] = useState(false)
  const [showReport, setShowReport] = useState(false)

  // 添加当前配置到对比
  const addCurrentConfig = async () => {
    if (!configuration.sensor || !configuration.magnet) {
      toast.error('请先选择传感器和磁铁')
      return
    }

    if (comparisonConfigs.length >= 4) {
      toast.error('最多只能对比4种配置')
      return
    }

    setIsComparing(true)
    try {
      const result = await runSimulation(configuration)
      
      const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b']
      const newConfig: ComparisonItem = {
        id: Date.now().toString(),
        name: `配置 ${comparisonConfigs.length + 1}`,
        configuration: { ...configuration },
        result,
        color: colors[comparisonConfigs.length]
      }
      
      addComparisonConfig(newConfig as any)
      toast.success('已添加到对比')
    } catch (error) {
      toast.error('仿真失败')
    } finally {
      setIsComparing(false)
    }
  }

  // 清空对比
  const handleClear = () => {
    clearComparisonConfigs()
    toast.success('已清空对比列表')
  }

  // 生成对比报告
  const generateReport = () => {
    setShowReport(true)
  }

  if (comparisonConfigs.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-10">
          <GitCompare size={48} className="mx-auto mb-4 text-slate-500" />
          <h3 className="text-lg font-semibold mb-2">对比模式</h3>
          <p className="text-slate-400 mb-6">添加多种配置进行对比分析</p>
          <button
            onClick={addCurrentConfig}
            disabled={isComparing}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {isComparing ? '计算中...' : '添加当前配置'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <GitCompare className="text-blue-400" />
            配置对比 ({comparisonConfigs.length}/4)
          </h2>
          <p className="text-slate-400">多维度性能对比分析</p>
        </div>
        <div className="flex gap-2">
          {comparisonConfigs.length < 4 && (
            <button
              onClick={addCurrentConfig}
              disabled={isComparing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus size={18} />
              添加配置
            </button>
          )}
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            清空
          </button>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            <Download size={18} />
            报告
          </button>
        </div>
      </div>

      {/* 配置列表 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonConfigs.map((config: any, index: number) => (
          <div 
            key={config.id} 
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
            style={{ borderLeft: `4px solid ${config.color || ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][index]}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={config.name}
                onChange={(e) => {
                  // 更新名称
                }}
                className="bg-transparent text-sm font-semibold border-none focus:outline-none w-full"
              />
              <button
                onClick={() => removeComparisonConfig(config.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div>传感器: {config.configuration.sensor?.name}</div>
              <div>磁铁: {config.configuration.magnet?.name}</div>
              <div>气隙: {config.configuration.params.airGap}mm</div>
            </div>
          </div>
        ))}
      </div>

      {/* 雷达图对比 */}
      <RadarComparison comparisonConfigs={comparisonConfigs} />

      {/* 性能对比柱状图 */}
      <PerformanceComparison comparisonConfigs={comparisonConfigs} />

      {/* 成本/性能权衡分析 */}
      <CostPerformanceAnalysis comparisonConfigs={comparisonConfigs} />

      {/* 综合评分 */}
      <OverallScore comparisonConfigs={comparisonConfigs} />

      {/* 对比报告模态框 */}
      {showReport && (
        <ComparisonReport 
          comparisonConfigs={comparisonConfigs} 
          onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  )
}

// 雷达图对比
function RadarComparison({ comparisonConfigs }: { comparisonConfigs: any[] }) {
  const radarData = [
    { subject: '精度', key: 'accuracy' },
    { subject: '速度', key: 'speed' },
    { subject: '稳定性', key: 'stability' },
    { subject: '成本效益', key: 'cost' },
    { subject: '可靠性', key: 'reliability' },
    { subject: '易用性', key: 'usability' },
  ].map(item => {
    const dataPoint: any = { subject: item.subject }
    
    comparisonConfigs.forEach((config: any, index) => {
      const result = config.result
      let value = 0
      
      switch (item.key) {
        case 'accuracy':
          value = Math.max(0, 100 - result.maxError * 10)
          break
        case 'speed':
          value = Math.min(100, config.configuration.sensor?.maxRpm / 1000 || 50)
          break
        case 'stability':
          value = Math.max(0, 100 - result.avgError * 20)
          break
        case 'cost':
          const res = config.configuration.sensor?.resolution || 12
          value = res * 8
          break
        case 'reliability':
          value = config.configuration.magnet?.material === 'smco' ? 90 : 75
          break
        case 'usability':
          value = config.configuration.params.airGap < 3 ? 85 : 70
          break
      }
      
      dataPoint[`config${index}`] = Math.round(value)
    })
    
    return dataPoint
  })

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b']

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-purple-400" />
        <h3 className="font-semibold">多维度雷达图对比</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            {comparisonConfigs.map((config: any, index: number) => (
              <Radar
                key={config.id}
                name={config.name}
                dataKey={`config${index}`}
                stroke={config.color || colors[index]}
                fill={config.color || colors[index]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            <Legend />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// 性能对比柱状图
function PerformanceComparison({ comparisonConfigs }: { comparisonConfigs: any[] }) {
  const performanceData = comparisonConfigs.map((config: any, index: number) => ({
    name: config.name,
    maxError: config.result.maxError,
    avgError: config.result.avgError,
    snr: config.result.snr,
    fill: config.color || ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][index]
  }))

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-yellow-400" />
        <h3 className="font-semibold">关键性能指标对比</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-64">
          <h4 className="text-sm text-slate-400 mb-2 text-center">最大误差 (°)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Bar dataKey="maxError" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h4 className="text-sm text-slate-400 mb-2 text-center">平均误差 (°)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Bar dataKey="avgError" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h4 className="text-sm text-slate-400 mb-2 text-center">信噪比 (dB)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Bar dataKey="snr" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// 成本/性能权衡分析
function CostPerformanceAnalysis({ comparisonConfigs }: { comparisonConfigs: any[] }) {
  // 简化的成本估算
  const costEstimate = (config: any) => {
    let cost = 0
    
    // 传感器成本
    const resolution = config.configuration.sensor?.resolution || 12
    cost += resolution * 2
    
    // 磁铁成本
    const materialCosts: Record<string, number> = { ndfeb: 5, smco: 15, alnico: 8, ferrite: 2 }
    cost += materialCosts[config.configuration.magnet?.material as string] || 5
    
    return cost
  }

  const scatterData = comparisonConfigs.map((config: any) => ({
    name: config.name,
    cost: costEstimate(config),
    performance: 100 - config.result.maxError * 20,
    error: config.result.maxError,
    z: 100
  }))

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={20} className="text-green-400" />
        <h3 className="font-semibold">成本/性能权衡分析</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="cost" 
              name="成本" 
              stroke="#64748b"
              label={{ value: '估算成本 ($)', position: 'bottom' }}
            />
            <YAxis 
              type="number" 
              dataKey="performance" 
              name="性能" 
              domain={[0, 100]}
              stroke="#64748b"
              label={{ value: '性能评分', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 100]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-slate-400">成本: ${data.cost}</p>
                      <p className="text-sm text-slate-400">性能: {data.performance.toFixed(1)}</p>
                      <p className="text-sm text-slate-400">误差: {data.error.toFixed(2)}°</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Scatter data={scatterData} fill="#22c55e">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={comparisonConfigs[index]?.color || ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][index]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        横轴：估算成本 | 纵轴：性能评分（100-最大误差×20）| 右上角为最优性价比区域
      </p>
    </div>
  )
}

// 综合评分
function OverallScore({ comparisonConfigs }: { comparisonConfigs: any[] }) {
  const scores = comparisonConfigs.map((config: any, index: number) => {
    // 综合评分计算
    const accuracyScore = Math.max(0, 100 - config.result.maxError * 20)
    const stabilityScore = Math.max(0, 100 - config.result.avgError * 30)
    const snrScore = Math.min(100, config.result.snr * 2)
    
    const totalScore = (accuracyScore + stabilityScore + snrScore) / 3
    
    return {
      ...config,
      accuracyScore,
      stabilityScore,
      snrScore,
      totalScore,
      rank: 0
    }
  })
  
  // 排序
  scores.sort((a, b) => b.totalScore - a.totalScore)
  scores.forEach((s, i) => s.rank = i + 1)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award size={20} className="text-yellow-400" />
        <h3 className="font-semibold">综合评分排名</h3>
      </div>
      
      <div className="space-y-3">
        {scores.map((config) => (
          <div 
            key={config.id}
            className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl"
            style={{ borderLeft: `4px solid ${config.color}` }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              config.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
              config.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
              config.rank === 3 ? 'bg-orange-600/20 text-orange-400' :
              'bg-slate-700 text-slate-500'
            }`}>
              {config.rank}
            </div>
            
            <div className="flex-1">
              <div className="font-semibold">{config.name}</div>
              <div className="text-xs text-slate-400">
                精度: {config.accuracyScore.toFixed(0)} | 
                稳定: {config.stabilityScore.toFixed(0)} | 
                SNR: {config.snrScore.toFixed(0)}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: config.color }}>
                {config.totalScore.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500">综合分</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 对比报告模态框
function ComparisonReport({ comparisonConfigs, onClose }: { comparisonConfigs: any[], onClose: () => void }) {
  const handleDownload = () => {
    // 生成报告内容
    const report = {
      title: 'OCS磁传感器配置对比报告',
      date: new Date().toLocaleString(),
      configs: comparisonConfigs.map(c => ({
        name: c.name,
        sensor: c.configuration.sensor?.name,
        magnet: c.configuration.magnet?.name,
        airGap: c.configuration.params.airGap,
        maxError: c.result.maxError,
        avgError: c.result.avgError,
        snr: c.result.snr
      }))
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comparison-report-${Date.now()}.json`
    a.click()
    
    toast.success('报告已下载')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">对比报告</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-400">
            生成时间: {new Date().toLocaleString()}
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4">
            <h4 className="font-semibold mb-3">对比配置摘要</h4>
            <div className="space-y-2 text-sm">
              {comparisonConfigs.map((config, i) => (
                <div key={config.id} className="flex justify-between py-2 border-b border-slate-700 last:border-0">
                  <span>{config.name}</span>
                  <span className="text-slate-400">
                    误差: {config.result.maxError.toFixed(2)}° | 
                    SNR: {config.result.snr.toFixed(1)}dB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors font-medium"
          >
            下载 JSON 报告
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
