'use client'

import { useState } from 'react'
import { useToolStore } from '@/store/toolStore'
import Sidebar from '@/components/layout/Sidebar'
import Canvas3D from '@/components/layout/Canvas3D'
import ResultsPanel from '@/components/layout/ResultsPanel'
import QuickSimButton from '@/components/simulation/QuickSimButton'
import { Toaster } from 'react-hot-toast'

export default function MagneticTool() {
  const [showComparison, setShowComparison] = useState(false)
  const { isSimulating, simulationProgress } = useToolStore()

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OCS</span>
          </div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Magnetic System Tool
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Comparison Mode
          </button>
          <button className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            Batch Sim
          </button>
          <button className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            Presets
          </button>
          <QuickSimButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas3D />
          
          {/* Simulation Progress Overlay */}
          {isSimulating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-slate-800 rounded-xl p-6 w-80">
                <h3 className="text-lg font-semibold mb-4">Simulating...</h3>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400 text-center">{simulationProgress.toFixed(1)}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Results Panel */}
        <ResultsPanel />
      </div>

      {/* Footer */}
      <footer className="h-8 bg-slate-900/80 backdrop-blur-md border-t border-slate-700 flex items-center justify-between px-4 text-xs text-slate-400 shrink-0">
        <div>Ready</div>
        <div>OCS Magnetic System Tool v1.0</div>
      </footer>

      <Toaster position="top-right" />
    </div>
  )
}
