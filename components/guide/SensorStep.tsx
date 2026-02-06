'use client'

import { useToolStore } from '@/store/toolStore'
import { sensorLibrary } from '@/lib/database/sensors'
import { Cpu, Check, ChevronRight } from 'lucide-react'

interface SensorStepProps {
  onComplete: () => void
}

export default function SensorStep({ onComplete }: SensorStepProps) {
  const { configuration, updateSensor } = useToolStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">选择磁传感器</h2>
        <p className="text-slate-400">请从库中选择适合您应用的磁传感器型号</p>
      </div>

      {/* Sensor List */}
      <div className="space-y-3">
        {sensorLibrary.map((sensor) => {
          const isSelected = configuration.sensor?.id === sensor.id

          return (
            <button
              key={sensor.id}
              onClick={() => updateSensor(sensor)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-500/20' : 'bg-slate-700'
                  }`}
                >
                  <Cpu size={24} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg">{sensor.name}</h3>
                    {isSelected && <Check size={20} className="text-blue-500" />}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{sensor.description}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500">分辨率</span>
                      <span className="ml-2 text-slate-300">{sensor.specs?.resolution || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500">精度</span>
                      <span className="ml-2 text-slate-300">{sensor.specs?.accuracy || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500">更新率</span>
                      <span className="ml-2 text-slate-300">{sensor.specs?.updateRate || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <span className="text-slate-500">工作温度</span>
                      <span className="ml-2 text-slate-300">{sensor.specs?.temperature || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selection Status */}
      {configuration.sensor ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={20} className="text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold text-green-400">已选择传感器</h4>
              <p className="text-sm text-slate-400">{configuration.sensor.name}</p>
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
          <p className="text-center text-slate-500">请选择一个传感器以继续</p>
        </div>
      )}
    </div>
  )
}
