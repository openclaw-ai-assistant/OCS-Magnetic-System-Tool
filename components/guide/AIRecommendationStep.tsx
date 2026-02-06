'use client'

import { useState } from 'react'
import { useToolStore } from '@/store/toolStore'
import { presetTemplates, sensorLibrary, magnetLibrary } from '@/lib/database/sensors'
import { Sparkles, Lightbulb, Target, Zap, Thermometer, Gauge, CheckCircle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface AIRecommendationProps {
  onComplete: () => void
}

export default function AIRecommendationStep({ onComplete }: AIRecommendationProps) {
  const { configuration, setConfiguration, applyPreset } = useToolStore()
  const [appDescription, setAppDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedRec, setSelectedRec] = useState<number | null>(null)

  // AI分析应用描述
  const analyzeApplication = async () => {
    if (!appDescription.trim()) {
      toast.error('请输入应用描述')
      return
    }

    setIsAnalyzing(true)
    setRecommendations([])

    // 模拟AI分析（实际应用可调用LLM API）
    await new Promise(resolve => setTimeout(resolve, 1500))

    const desc = appDescription.toLowerCase()
    const recs = []

    // 根据关键词匹配推荐
    if (desc.includes('伺服') || desc.includes('servo') || desc.includes('电机')) {
      recs.push({
        type: 'preset',
        title: '伺服电机标准配置',
        icon: Zap,
        confidence: 95,
        reason: '检测到电机控制应用，推荐高精度传感器配合标准气隙',
        config: {
          sensor: sensorLibrary.find(s => s.id === 'ma734'),
          magnet: magnetLibrary.find(m => m.id === 'cyl-8x5-ndfeb'),
          params: { airGap: 2.0, rpm: 6000, temperature: 60 }
        }
      })
    }

    if (desc.includes('机器人') || desc.includes('robot') || desc.includes('关节')) {
      recs.push({
        type: 'preset',
        title: '机器人关节配置',
        icon: Target,
        confidence: 92,
        reason: '关节应用需要高可靠性和侧轴安装能力',
        config: {
          sensor: sensorLibrary.find(s => s.id === 'ma850'),
          magnet: magnetLibrary.find(m => m.id === 'ring-15x8x5-ndfeb'),
          params: { airGap: 2.5, rpm: 2000, temperature: 50 }
        }
      })
    }

    if (desc.includes('高速') || desc.includes('high speed') || desc.includes('50k')) {
      recs.push({
        type: 'preset',
        title: '高速电机优化配置',
        icon: Gauge,
        confidence: 88,
        reason: '高速应用需要快速响应传感器和稳定磁场',
        config: {
          sensor: sensorLibrary.find(s => s.id === 'ma800'),
          magnet: magnetLibrary.find(m => m.id === 'cyl-8x5-ndfeb'),
          params: { airGap: 2.0, rpm: 50000, temperature: 80 }
        }
      })
    }

    if (desc.includes('精度') || desc.includes('precision') || desc.includes('测量')) {
      recs.push({
        type: 'preset',
        title: '高精度测量配置',
        icon: Target,
        confidence: 96,
        reason: '精密测量应用推荐15位超高精度传感器',
        config: {
          sensor: sensorLibrary.find(s => s.id === 'ma600'),
          magnet: magnetLibrary.find(m => m.id === 'cyl-10x10-ndfeb'),
          params: { airGap: 1.5, rpm: 1000, temperature: 25 }
        }
      })
    }

    if (desc.includes('汽车') || desc.includes('automotive') || desc.includes('转向')) {
      recs.push({
        type: 'preset',
        title: '汽车EPS配置',
        icon: Thermometer,
        confidence: 90,
        reason: '汽车应用需要宽温度范围和可靠性',
        config: {
          sensor: sensorLibrary.find(s => s.id === 'ma734'),
          magnet: magnetLibrary.find(m => m.id === 'ring-20x10x8-smco'),
          params: { airGap: 2.5, rpm: 600, temperature: 85 }
        }
      })
    }

    // 如果没有匹配到，提供通用推荐
    if (recs.length === 0) {
      recs.push({
        type: 'preset',
        title: '通用工业配置',
        icon: Lightbulb,
        confidence: 75,
        reason: '基于一般工业应用的标准推荐',
        config: {
          sensor: sensorLibrary.find(s => s.id === 'ma732'),
          magnet: magnetLibrary.find(m => m.id === 'cyl-8x5-ndfeb'),
          params: { airGap: 2.5, rpm: 3000, temperature: 25 }
        }
      })
    }

    // 添加一个自定义选项
    recs.push({
      type: 'custom',
      title: '手动配置',
      icon: Sparkles,
      confidence: 0,
      reason: '您可以选择手动配置所有参数',
      config: null
    })

    setRecommendations(recs)
    setIsAnalyzing(false)
    toast.success('分析完成！')
  }

  // 应用推荐配置
  const applyRecommendation = (index: number) => {
    const rec = recommendations[index]
    
    if (rec.type === 'custom') {
      onComplete()
      return
    }

    if (rec.config) {
      setConfiguration({
        ...configuration,
        sensor: rec.config.sensor || null,
        magnet: rec.config.magnet || null,
        params: { ...configuration.params, ...rec.config.params }
      })
      toast.success(`已应用：${rec.title}`)
      onComplete()
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-yellow-400" />
          AI 智能推荐
        </h2>
        <p className="text-slate-400">描述您的应用场景，AI为您推荐最佳配置</p>
      </div>

      {/* 输入框 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <label className="block text-sm text-slate-400 mb-2">
          描述您的应用需求
        </label>
        <textarea
          value={appDescription}
          onChange={(e) => setAppDescription(e.target.value)}
          placeholder="例如：伺服电机控制，转速3000rpm，需要高精度角度测量，工作温度60°C..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
        />
        
        <div className="flex flex-wrap gap-2 mt-3">
          {['伺服电机 3000rpm', '机器人关节', '高速电机 50000rpm', '高精度测量', '汽车转向'].map((example) => (
            <button
              key={example}
              onClick={() => setAppDescription(example)}
              className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* 分析按钮 */}
      {!recommendations.length && (
        <button
          onClick={analyzeApplication}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 rounded-xl transition-all font-semibold text-lg"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              AI分析中...
            </>
          ) : (
            <>
              <Sparkles size={24} />
              获取智能推荐
            </>
          )}
        </button>
      )}

      {/* 推荐结果 */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">推荐配置</h3>
          
          {recommendations.map((rec, index) => {
            const IconComponent = rec.icon
            return (
              <button
                key={index}
                onClick={() => setSelectedRec(index)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedRec === index
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    rec.type === 'custom' ? 'bg-slate-700' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{rec.title}</h4>
                      {rec.confidence > 0 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          置信度 {rec.confidence}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-400 mt-1">{rec.reason}</p>
                    
                    {rec.config && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-slate-900 rounded">
                          传感器: {rec.config.sensor?.name}
                        </span>
                        <span className="px-2 py-1 bg-slate-900 rounded">
                          磁铁: {rec.config.magnet?.name}
                        </span>
                        <span className="px-2 py-1 bg-slate-900 rounded">
                          气隙: {rec.config.params.airGap}mm
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}

          {/* 应用按钮 */}
          {selectedRec !== null && (
            <button
              onClick={() => applyRecommendation(selectedRec)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all font-semibold"
            >
              <CheckCircle size={20} />
              应用推荐配置
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

      {/* 说明 */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Lightbulb size={18} className="text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-400">
            <p className="font-medium mb-1">AI推荐说明</p>
            <p>AI基于您描述的应用场景，结合行业经验数据库，为您推荐最适合的传感器和磁铁配置。推荐结果仅供参考，实际应用请结合具体测试验证。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
