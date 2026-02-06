'use client'

import { useToolStore } from '@/store/toolStore'
import { magnetLibrary } from '@/lib/database/sensors'
import { Magnet, Check, ChevronRight } from 'lucide-react'

interface MagnetStepProps {
  onComplete: () => void
}

export default function MagnetStep({ onComplete }: MagnetStepProps) {
  const { configuration, updateMagnet } = useToolStore()

  const magnetShapes: Record<string, { icon: string; color: string }> = {
    cylinder: { icon: '⬭', color: 'bg-blue-500/20 text-blue-400' },
    ring: { icon: '◎', color: 'bg-purple-500/20 text-purple-400' },
    rectangle: { icon: '▭', color: 'bg-green-500/20 text-green-400' },
    arc: { icon: '⌒', color: 'bg-orange-500/20 text-orange-400' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">选择磁铁</h2>
        <p className="text-slate-400">选择磁铁类型和规格</p>
      </div>

      {/* Magnet List */}
      <div className="space-y-3">
        {magnetLibrary.map((magnet) => {
          const isSelected = configuration.magnet?.id === magnet.id
          const shapeInfo = magnetShapes[magnet.shape] || { icon: '?', color: 'bg-slate-700' }

          return (
            <button
              key={magnet.id}
              onClick={() => updateMagnet(magnet)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${shapeInfo.color}`}
                >
                  <Magnet size={24} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg">{magnet.name}</h3>
                    {isSelected && <Check size={20} className="text-blue-500" />}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{magnet.description}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500 block">类型</span>
                      <span className="text-slate-300 capitalize">{magnet.shape}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500 block">材质</span>
                      <span className="text-slate-300">{magnet.material}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500 block">剩磁</span>
                      <span className="text-slate-300">{magnet.remanence} T</span>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(magnet.dimensions).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400"
                      >
                        {key}: {value}mm
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selection Status */}
      {configuration.magnet ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={20} className="text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold text-green-400">已选择磁铁</h4>
              <p className="text-sm text-slate-400">{configuration.magnet.name}</p>
            </div>
            <button
              onClick={onComplete}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              继续
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-center text-slate-500">请选择一个磁铁以继续</p>
        </div>
      )}
    </div>
  )
}
