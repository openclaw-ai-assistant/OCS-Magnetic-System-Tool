'use client'

import { useState } from 'react'
import { useToolStore } from '@/store/toolStore'
import { getTemplatesByCategory } from '@/lib/database/sensors'
import { Check, Search, Sparkles, ChevronRight } from 'lucide-react'

interface PresetStepProps {
  onComplete: () => void
}

export default function PresetStep({ onComplete }: PresetStepProps) {
  const { configuration, applyPreset } = useToolStore()
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const templatesByCategory = getTemplatesByCategory()
  const categories = Object.keys(templatesByCategory)

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId)
    applyPreset(presetId)
  }

  const filteredTemplates = searchQuery
    ? Object.values(templatesByCategory)
        .flat()
        .filter(t => 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
          <Sparkles size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">选择预设配置</h2>
        <p className="text-slate-400">从行业常用配置快速开始，或选择自定义配置</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="搜索应用场景..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Templates Grid */}
      {filteredTemplates ? (
        // Search Results
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-500">搜索结果</h3>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedPreset === template.id}
              onClick={() => handleSelectPreset(template.id)}
            />
          ))}
        </div>
      ) : (
        // Category View
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {category}
              </h3>
              <div className="space-y-3">
                {templatesByCategory[category].map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedPreset === template.id}
                    onClick={() => handleSelectPreset(template.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Option */}
      <div className="pt-4 border-t border-slate-700">
        <button
          onClick={() => {
            setSelectedPreset('custom')
            onComplete()
          }}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
            selectedPreset === 'custom'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">
              🔧
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">自定义配置</h3>
              <p className="text-sm text-slate-400">从头开始手动配置所有参数</p>
            </div>
            {selectedPreset === 'custom' && <Check size={24} className="text-blue-500" />}
          </div>
        </button>
      </div>

      {/* Continue Button */}
      {selectedPreset && selectedPreset !== 'custom' && (
        <button
          onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all font-semibold"
        >
          使用此配置开始
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}

// Template Card Component
interface TemplateCardProps {
  template: {
    id: string
    name: string
    description: string
    icon?: string
    category: string
  }
  isSelected: boolean
  onClick: () => void
}

function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0">
          {template.icon || '⚙️'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold truncate">{template.name}</h3>
            {isSelected && <Check size={20} className="text-blue-500 flex-shrink-0" />}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">{template.description}</p>
        </div>
      </div>
    </button>
  )
}
