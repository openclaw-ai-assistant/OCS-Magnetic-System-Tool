import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  ToolConfiguration, 
  ActiveTab, 
  SimulationResult,
  ComparisonConfig,
  BatchSimulationJob,
  Sensor,
  Magnet,
  Vector3D
} from '@/types'

interface ToolState {
  // UI State
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  
  // Configuration
  configuration: ToolConfiguration
  updateSensor: (sensor: Sensor | null) => void
  updateSensorPosition: (position: { position?: Vector3D; rotation?: Vector3D }) => void
  updateMagnet: (magnet: Magnet | null) => void
  updateMagnetPosition: (position: { position?: Vector3D; rotation?: Vector3D }) => void
  updateParams: (params: Partial<ToolConfiguration['params']>) => void
  resetConfiguration: () => void
  
  // Simulation State
  isSimulating: boolean
  simulationProgress: number
  simulationResult: SimulationResult | null
  setIsSimulating: (simulating: boolean) => void
  setSimulationProgress: (progress: number) => void
  setSimulationResult: (result: SimulationResult | null) => void
  
  // Comparison Mode
  comparisonConfigs: ComparisonConfig[]
  addComparisonConfig: (config: ComparisonConfig) => void
  removeComparisonConfig: (id: string) => void
  clearComparisonConfigs: () => void
  
  // Batch Simulation
  batchJobs: BatchSimulationJob[]
  addBatchJob: (job: BatchSimulationJob) => void
  updateBatchJob: (id: string, updates: Partial<BatchSimulationJob>) => void
  removeBatchJob: (id: string) => void
  
  // 3D View State
  showFieldLines: boolean
  showFieldVectors: boolean
  showHeatmap: boolean
  vectorDensity: number
  heatmapResolution: number
  toggleFieldLines: () => void
  toggleFieldVectors: () => void
  toggleHeatmap: () => void
  setVectorDensity: (density: number) => void
  setHeatmapResolution: (resolution: number) => void
}

const defaultConfiguration: ToolConfiguration = {
  sensor: null,
  sensorPosition: {
    position: { x: 0, y: 0, z: 2 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  magnet: null,
  magnetPosition: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  params: {
    airGap: 2,
    rpm: 1000,
    temperature: 25,
    samplesPerRevolution: 360,
    noiseLevel: 0.1
  }
}

export const useToolStore = create<ToolState>()(
  persist(
    (set, get) => ({
      // UI State
      activeTab: 'sensor',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Configuration
      configuration: defaultConfiguration,
      updateSensor: (sensor) => set((state) => ({
        configuration: { ...state.configuration, sensor }
      })),
      updateSensorPosition: (positionUpdate) => set((state) => ({
        configuration: {
          ...state.configuration,
          sensorPosition: {
            position: { ...state.configuration.sensorPosition.position, ...positionUpdate.position },
            rotation: { ...state.configuration.sensorPosition.rotation, ...positionUpdate.rotation }
          }
        }
      })),
      updateMagnet: (magnet) => set((state) => ({
        configuration: { ...state.configuration, magnet }
      })),
      updateMagnetPosition: (positionUpdate) => set((state) => ({
        configuration: {
          ...state.configuration,
          magnetPosition: {
            position: { ...state.configuration.magnetPosition.position, ...positionUpdate.position },
            rotation: { ...state.configuration.magnetPosition.rotation, ...positionUpdate.rotation }
          }
        }
      })),
      updateParams: (params) => set((state) => ({
        configuration: {
          ...state.configuration,
          params: { ...state.configuration.params, ...params }
        }
      })),
      resetConfiguration: () => set({ configuration: defaultConfiguration }),
      
      // Simulation State
      isSimulating: false,
      simulationProgress: 0,
      simulationResult: null,
      setIsSimulating: (simulating) => set({ isSimulating: simulating }),
      setSimulationProgress: (progress) => set({ simulationProgress: progress }),
      setSimulationResult: (result) => set({ simulationResult: result }),
      
      // Comparison Mode
      comparisonConfigs: [],
      addComparisonConfig: (config) => set((state) => ({
        comparisonConfigs: [...state.comparisonConfigs, config]
      })),
      removeComparisonConfig: (id) => set((state) => ({
        comparisonConfigs: state.comparisonConfigs.filter(c => c.id !== id)
      })),
      clearComparisonConfigs: () => set({ comparisonConfigs: [] }),
      
      // Batch Simulation
      batchJobs: [],
      addBatchJob: (job) => set((state) => ({
        batchJobs: [...state.batchJobs, job]
      })),
      updateBatchJob: (id, updates) => set((state) => ({
        batchJobs: state.batchJobs.map(job => 
          job.id === id ? { ...job, ...updates } : job
        )
      })),
      removeBatchJob: (id) => set((state) => ({
        batchJobs: state.batchJobs.filter(job => job.id !== id)
      })),
      
      // 3D View State
      showFieldLines: true,
      showFieldVectors: false,
      showHeatmap: false,
      vectorDensity: 20,
      heatmapResolution: 50,
      toggleFieldLines: () => set((state) => ({ showFieldLines: !state.showFieldLines })),
      toggleFieldVectors: () => set((state) => ({ showFieldVectors: !state.showFieldVectors })),
      toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
      setVectorDensity: (density) => set({ vectorDensity: density }),
      setHeatmapResolution: (resolution) => set({ heatmapResolution: resolution })
    }),
    {
      name: 'ocs-magnetic-tool-storage',
      partialize: (state) => ({
        configuration: state.configuration,
        showFieldLines: state.showFieldLines,
        showFieldVectors: state.showFieldVectors,
        showHeatmap: state.showHeatmap,
        vectorDensity: state.vectorDensity,
        heatmapResolution: state.heatmapResolution
      })
    }
  )
)
