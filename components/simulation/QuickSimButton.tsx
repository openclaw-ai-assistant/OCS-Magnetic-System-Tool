'use client'

import { useToolStore } from '@/store/toolStore'
import { simulateSensorOutput } from '@/lib/simulation/magnetic-field'
import { Play, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function QuickSimButton() {
  const { 
    configuration, 
    isSimulating, 
    setIsSimulating, 
    setSimulationProgress, 
    setSimulationResult 
  } = useToolStore()

  const handleSimulate = async () => {
    if (!configuration.sensor || !configuration.magnet) {
      toast.error('Please select both sensor and magnet first!')
      return
    }

    setIsSimulating(true)
    setSimulationProgress(0)

    try {
      const result = await simulateSensorOutput(
        configuration,
        (progress) => setSimulationProgress(progress)
      )
      
      setSimulationResult(result)
      setIsSimulating(false)
      
      toast.success(`Simulation complete! Max error: ${result.maxError.toFixed(3)}°`)
    } catch (error) {
      console.error('Simulation error:', error)
      setIsSimulating(false)
      toast.error('Simulation failed. Please check configuration.')
    }
  }

  return (
    <button
      onClick={handleSimulate}
      disabled={isSimulating}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200
        ${isSimulating 
          ? 'bg-slate-700 cursor-not-allowed' 
          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25'
        }
      `}
    >
      {isSimulating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Computing...
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          QuickSim
        </>
      )}
    </button>
  )
}
