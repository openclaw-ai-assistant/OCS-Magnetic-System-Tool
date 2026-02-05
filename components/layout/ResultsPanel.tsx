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
  Legend
} from 'recharts'

export default function ResultsPanel() {
  const { activeTab, simulationResult, configuration } = useToolStore()

  if (activeTab !== 'results') {
    return (
      <aside className="w-96 bg-slate-900/90 border-l border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">Results</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Switch to Results tab to view charts
        </div>
      </aside>
    )
  }

  if (!simulationResult) {
    return (
      <aside className="w-96 bg-slate-900/90 border-l border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">Results</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm p-4 text-center">
          Run QuickSim to generate results
        </div>
      </aside>
    )
  }

  // Prepare chart data
  const angleErrorData = simulationResult.angleError.map((error, index) => ({
    angle: index,
    error: error
  }))

  const signalData = simulationResult.outputSignal.sin.map((sin, index) => ({
    angle: index,
    sin: sin,
    cos: simulationResult.outputSignal.cos[index]
  }))

  return (
    <aside className="w-[480px] bg-slate-900/90 border-l border-slate-700 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-white">Simulation Results</h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Max Error"
            value={`${simulationResult.maxError.toFixed(3)}°`}
            color={simulationResult.maxError < 1 ? 'green' : simulationResult.maxError < 2 ? 'yellow' : 'red'}
          />
          <StatCard
            label="RMS Error"
            value={`${simulationResult.rmsError.toFixed(3)}°`}
            color="blue"
          />
          <StatCard
            label="SNR"
            value={`${simulationResult.snr.toFixed(1)} dB`}
            color="purple"
          />
          <StatCard
            label="Linearity"
            value={`${simulationResult.linearity.toFixed(3)}°`}
            color="cyan"
          />
        </div>

        {/* Angle Error Chart */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Angle Error</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={angleErrorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="angle" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickFormatter={(value) => `${value}°`}
                />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="error" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Output Signals Chart */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Output Signals (Sin/Cos)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="angle" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickFormatter={(value) => `${value}°`}
                />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sin" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="cos" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Summary */}
        <div className={`p-4 rounded-lg border ${
          simulationResult.maxError < 0.5 
            ? 'bg-green-500/10 border-green-500/30'
            : simulationResult.maxError < 1.0
            ? 'bg-blue-500/10 border-blue-500/30'
            : simulationResult.maxError < 2.0
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <h4 className="text-sm font-medium mb-2">
            {simulationResult.maxError < 0.5 
              ? '✅ Excellent Performance'
              : simulationResult.maxError < 1.0
              ? '✅ Good Performance'
              : simulationResult.maxError < 2.0
              ? '⚠️ Moderate Performance'
              : '❌ Needs Improvement'
            }
          </h4>
          <p className="text-xs text-slate-400">
            {simulationResult.maxError < 0.5 
              ? 'This configuration provides excellent accuracy suitable for high-precision applications.'
              : simulationResult.maxError < 1.0
              ? 'This configuration provides good accuracy suitable for most applications.'
              : simulationResult.maxError < 2.0
              ? 'Consider optimizing sensor position or magnet selection for better accuracy.'
              : 'Significant improvements needed. Try reducing air gap or using a stronger magnet.'
            }
          </p>
        </div>

        {/* Configuration Summary */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">Configuration</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Sensor:</span>
              <span className="text-white">{configuration.sensor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Magnet:</span>
              <span className="text-white">{configuration.magnet?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Air Gap:</span>
              <span className="text-white">{configuration.params.airGap} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">RPM:</span>
              <span className="text-white">{configuration.params.rpm}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
  }

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-xs opacity-80">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
