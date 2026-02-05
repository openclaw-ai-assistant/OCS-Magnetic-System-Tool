'use client'

import { useToolStore } from '@/store/toolStore'
import { 
  Cpu, 
  Move3d, 
  Magnet, 
  Settings, 
  BarChart3, 
  FileText,
  RotateCcw
} from 'lucide-react'

const tabs = [
  { id: 'sensor', label: 'Sensor Family', icon: Cpu },
  { id: 'position', label: 'Sensor Location', icon: Move3d },
  { id: 'magnet', label: 'Magnets', icon: Magnet },
  { id: 'parameters', label: 'Parameters', icon: Settings },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'report', label: 'Report', icon: FileText },
]

export default function Sidebar() {
  const { activeTab, setActiveTab, resetConfiguration } = useToolStore()

  return (
    <aside className="w-80 bg-slate-900/90 border-r border-slate-700 flex flex-col shrink-0">
      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Separator */}
      <div className="mx-3 h-px bg-slate-700" />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        <TabContent />
      </div>

      {/* Reset Button */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={resetConfiguration}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Configuration
        </button>
      </div>
    </aside>
  )
}

// Tab Content Component
function TabContent() {
  const { activeTab } = useToolStore()

  switch (activeTab) {
    case 'sensor':
      return <SensorTab />
    case 'position':
      return <PositionTab />
    case 'magnet':
      return <MagnetTab />
    case 'parameters':
      return <ParametersTab />
    case 'results':
      return <ResultsTab />
    case 'report':
      return <ReportTab />
    default:
      return null
  }
}

// Sensor Selection Tab
function SensorTab() {
  const { configuration, updateSensor } = useToolStore()
  const { magAlphaSensors, magVectorSensors } = require('@/lib/database/sensors')

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">MagAlpha Sensor</h3>
        <div className="space-y-2">
          {magAlphaSensors.map((sensor: any) => (
            <button
              key={sensor.id}
              onClick={() => updateSensor(sensor)}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                configuration.sensor?.id === sensor.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-sm">{sensor.name}</div>
              <div className="text-xs text-slate-400 mt-1">
                {sensor.resolution}-bit | {sensor.maxRpm.toLocaleString()} RPM
              </div>
              <div className="text-xs text-slate-500 mt-1">{sensor.package}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">MagVector Sensor</h3>
        <div className="space-y-2">
          {magVectorSensors.map((sensor: any) => (
            <button
              key={sensor.id}
              onClick={() => updateSensor(sensor)}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                configuration.sensor?.id === sensor.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-sm">{sensor.name}</div>
              <div className="text-xs text-slate-400 mt-1">
                {sensor.resolution}-bit | {sensor.mountType}
              </div>
              <div className="text-xs text-slate-500 mt-1">{sensor.package}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Position Configuration Tab
function PositionTab() {
  const { configuration, updateSensorPosition } = useToolStore()
  const pos = configuration.sensorPosition

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Position (mm)</h3>
        <div className="space-y-2">
          {['x', 'y', 'z'].map((axis) => (
            <div key={axis} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-4 uppercase">{axis}</span>
              <input
                type="number"
                value={pos.position[axis as 'x' | 'y' | 'z']}
                onChange={(e) => updateSensorPosition({
                  position: { [axis]: parseFloat(e.target.value) || 0 }
                })}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Rotation (°)</h3>
        <div className="space-y-2">
          {['x', 'y', 'z'].map((axis) => (
            <div key={axis} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-4 uppercase">{axis}</span>
              <input
                type="number"
                value={pos.rotation[axis as 'x' | 'y' | 'z']}
                onChange={(e) => updateSensorPosition({
                  rotation: { [axis]: parseFloat(e.target.value) || 0 }
                })}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                step="1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-slate-800/50 rounded-lg text-xs text-slate-400">
        Adjust sensor position relative to magnet center
      </div>
    </div>
  )
}

// Magnet Selection Tab
function MagnetTab() {
  const { configuration, updateMagnet, updateMagnetPosition } = useToolStore()
  const { magnetLibrary } = require('@/lib/database/sensors')
  const magPos = configuration.magnetPosition

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Select Magnet</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {magnetLibrary.map((magnet: any) => (
            <button
              key={magnet.id}
              onClick={() => updateMagnet(magnet)}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                configuration.magnet?.id === magnet.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-sm">{magnet.name}</div>
              <div className="text-xs text-slate-400 mt-1">
                {magnet.shape} | {magnet.material}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Br: {magnet.remanence} T
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Magnet Position</h3>
        <div className="space-y-2">
          {['x', 'y', 'z'].map((axis) => (
            <div key={axis} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-4 uppercase">{axis}</span>
              <input
                type="number"
                value={magPos.position[axis as 'x' | 'y' | 'z']}
                onChange={(e) => updateMagnetPosition({
                  position: { [axis]: parseFloat(e.target.value) || 0 }
                })}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                step="0.1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Parameters Tab
function ParametersTab() {
  const { configuration, updateParams } = useToolStore()
  const params = configuration.params

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Air Gap (mm)</h3>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.1"
          value={params.airGap}
          onChange={(e) => updateParams({ airGap: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-center text-sm text-blue-400 mt-1">{params.airGap} mm</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Rotation Speed (RPM)</h3>
        <input
          type="number"
          value={params.rpm}
          onChange={(e) => updateParams({ rpm: parseInt(e.target.value) || 0 })}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Temperature (°C)</h3>
        <input
          type="number"
          value={params.temperature}
          onChange={(e) => updateParams({ temperature: parseInt(e.target.value) || 25 })}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Samples/Revolution</h3>
        <select
          value={params.samplesPerRevolution}
          onChange={(e) => updateParams({ samplesPerRevolution: parseInt(e.target.value) })}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
        >
          <option value={360}>360 (1° resolution)</option>
          <option value={720}>720 (0.5° resolution)</option>
          <option value={1440}>1440 (0.25° resolution)</option>
          <option value={2880}>2880 (0.125° resolution)</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Noise Level (%)</h3>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={params.noiseLevel}
          onChange={(e) => updateParams({ noiseLevel: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-center text-sm text-blue-400 mt-1">{(params.noiseLevel * 100).toFixed(1)}%</div>
      </div>
    </div>
  )
}

// Results Tab
function ResultsTab() {
  const { simulationResult } = useToolStore()

  if (!simulationResult) {
    return (
      <div className="text-center text-slate-400 py-8">
        Run simulation to see results
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-400">Max Error</div>
          <div className="text-lg font-semibold text-white">
            {simulationResult.maxError.toFixed(3)}°
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-400">RMS Error</div>
          <div className="text-lg font-semibold text-white">
            {simulationResult.rmsError.toFixed(3)}°
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-400">SNR</div>
          <div className="text-lg font-semibold text-white">
            {simulationResult.snr.toFixed(1)} dB
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-400">Linearity</div>
          <div className="text-lg font-semibold text-white">
            {simulationResult.linearity.toFixed(3)}°
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-blue-400 mb-2">Performance Summary</h4>
        <p className="text-xs text-slate-400">
          {simulationResult.maxError < 0.5 
            ? '✅ Excellent accuracy for high-precision applications'
            : simulationResult.maxError < 1.0
            ? '✅ Good accuracy for most applications'
            : simulationResult.maxError < 2.0
            ? '⚠️ Moderate accuracy - consider optimizing position'
            : '❌ Poor accuracy - significant improvements needed'
          }
        </p>
      </div>
    </div>
  )
}

// Report Tab
function ReportTab() {
  const { configuration, simulationResult } = useToolStore()

  const generatePDF = () => {
    alert('PDF generation will be implemented in the next update!')
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-slate-800/50 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Configuration Summary</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Sensor:</span>
            <span className="text-white">{configuration.sensor?.name || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Magnet:</span>
            <span className="text-white">{configuration.magnet?.name || 'Not selected'}</span>
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

      <button
        onClick={generatePDF}
        disabled={!simulationResult}
        className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all"
      >
        {simulationResult ? 'Generate PDF Report' : 'Run Simulation First'}
      </button>

      <div className="text-xs text-slate-500">
        Report includes: configuration, simulation results, and charts
      </div>
    </div>
  )
}
