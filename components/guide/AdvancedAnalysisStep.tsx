'use client'

import { useState } from 'react'
import AdvancedCharts from '@/components/advanced-charts/AdvancedCharts'
import ComparisonMode from '@/components/comparison/ComparisonMode'
import { BarChart3, GitCompare, ChevronRight, X } from 'lucide-react'

interface AdvancedAnalysisStepProps {
  onComplete: () => void
}

export default function AdvancedAnalysisStep({ onComplete }: AdvancedAnalysisStepProps) {
  const [activeTab, setActiveTab] = useState<'charts' | 'comparison'>('charts')

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2">高级分析</h2>
        <p className="text-slate-400">深度数据分析与多配置对比</p>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'charts'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <BarChart3 size={18} />
          高级图表
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'comparison'
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <GitCompare size={18} />
          对比模式
        </button>
      </div>

      {/* 内容区域 */}
      <div className="bg-slate-900/30 border border-slate-700/50 rounded-xl overflow-hidden">
        {activeTab === 'charts' ? (
          <AdvancedCharts />
        ) : (
          <ComparisonMode />
        )}
      </div>

      {/* 继续按钮 */}
      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all font-semibold"
      >
        完成分析
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
