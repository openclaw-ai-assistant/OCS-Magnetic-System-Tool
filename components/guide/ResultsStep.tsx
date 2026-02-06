'use client'

import { useToolStore } from '@/store/toolStore'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Download, RotateCcw, FileText, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ResultsStepProps {
  onRestart: () => void
}

export default function ResultsStep({ onRestart }: ResultsStepProps) {
  const { simulationResult, configuration } = useToolStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'export'>('overview')

  if (!simulationResult) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-400">请先运行仿真</p>
      </div>
    )
  }

  const handleExportPDF = () => {
    toast.success('报告生成中...')
    // TODO: Implement PDF export
  }

  const handleExportCSV = () => {
    toast.success('CSV 导出中...')
    // TODO: Implement CSV export
  }

  const chartData = simulationResult.angleData.map((point) => ({
    angle: point.mechanicalAngle,
    error: point.error,
    sin: point.sinOutput,
    cos: point.cosOutput,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">仿真结果</h2>
        <p className="text-slate-400">查看详细的仿真数据和分析</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
        {[
          { id: 'overview', label: '概览', icon: Check },
          { id: 'charts', label: '图表', icon: LineChart },
          { id: 'export', label: '导出', icon: Download },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-sm text-blue-400 mb-1">最大角度误差</div>
              <div className="text-3xl font-bold">{simulationResult.maxError.toFixed(2)}°</div>
              <div className="text-xs text-slate-400 mt-2">
                发生在 {simulationResult.maxErrorAngle.toFixed(1)}° 位置
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-sm text-green-400 mb-1">平均角度误差</div>
              <div className="text-3xl font-bold">{simulationResult.avgError.toFixed(2)}°</div>
              <div className="text-xs text-slate-400 mt-2">全范围平均值</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-4">
              <div className="text-sm text-purple-400 mb-1">平均磁场</div>
              <div className="text-3xl font-bold">
                {simulationResult.magneticField.length > 0
                  ? (Math.sqrt(
                      simulationResult.magneticField[0].x ** 2 +
                      simulationResult.magneticField[0].y ** 2 +
                      simulationResult.magneticField[0].z ** 2
                    ) / 1000).toFixed(1)
                  : '0.0'} mT
              </div>
              <div className="text-xs text-slate-400 mt-2">传感器位置处</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-4">
              <div className="text-sm text-orange-400 mb-1">信噪比</div>
              <div className="text-3xl font-bold">{simulationResult.snr.toFixed(1)} dB</div>
              <div className="text-xs text-slate-400 mt-2">信号质量评估</div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold mb-4">配置摘要</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">传感器</span>
                <span>{configuration.sensor?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">磁铁</span>
                <span>{configuration.magnet?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">气隙</span>
                <span>{configuration.params.airGap} mm</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">采样点数</span>
                <span>{simulationResult.angleData.length} 点</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-4">
          {/* Error Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold mb-4">角度误差曲线</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="angle"
                    stroke="#64748b"
                    label={{ value: '机械角度 (°)', position: 'bottom' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    label={{ value: '误差 (°)', angle: -90, position: 'insideLeft' }}
                  />
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
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="角度误差"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sin/Cos Outputs */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold mb-4">Sin/Cos 输出</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="angle"
                    stroke="#64748b"
                    label={{ value: '机械角度 (°)', position: 'bottom' }}
                  />
                  <YAxis stroke="#64748b" domain={[-1.2, 1.2]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sin"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Sin"
                  />
                  <Line
                    type="monotone"
                    dataKey="cos"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Cos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} />
              导出报告
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <FileText size={20} className="text-red-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">PDF 报告</div>
                    <div className="text-xs text-slate-400">包含所有图表和数据</div>
                  </div>
                </div>
                <Download size={20} className="text-slate-400" />
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FileText size={20} className="text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">CSV 数据</div>
                    <div className="text-xs text-slate-400">原始数据表格</div>
                  </div>
                </div>
                <Download size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
      >
        <RotateCcw size={18} />
        开始新的仿真
      </button>
    </div>
  )
}
