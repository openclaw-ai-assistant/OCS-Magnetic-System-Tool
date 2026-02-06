// OCS Magnetic System Tool - Type Definitions

// Vector3D for positions and field calculations
export interface Vector3D {
  x: number
  y: number
  z: number
}

// Sensor Types
export type SensorFamily = 'magalpha' | 'magvector'
export type SensorMountType = 'end-of-shaft' | 'side-shaft' | 'side-shaft-orthogonal' | 'circular' | 'linear'

export interface Sensor {
  id: string
  name: string
  description?: string
  family: SensorFamily
  mountType: SensorMountType
  resolution: number // bits
  maxRpm: number
  package: string
  features: string[]
  specs?: {
    resolution?: string
    accuracy?: string
    updateRate?: string
    temperature?: string
  }
}

// Magnet Types
export type MagnetShape = 'cylinder' | 'ring' | 'rectangle' | 'arc'
export type MagnetMaterial = 'ndfeb' | 'smco' | 'alnico' | 'ferrite'
export type MagnetizationDirection = 'axial' | 'diametrical' | 'radial'

export interface Magnet {
  id: string
  name: string
  description?: string
  shape: MagnetShape
  material: MagnetMaterial
  dimensions: {
    diameter?: number // mm
    height?: number // mm
    width?: number // mm
    length?: number // mm
    innerDiameter?: number // mm for ring
    outerDiameter?: number // mm for ring
    angle?: number // degrees for arc
  }
  magnetization: MagnetizationDirection
  remanence: number // Tesla
  temperature: number // °C
}

// Position Configuration
export interface SensorPosition {
  position: Vector3D // mm
  rotation: Vector3D // degrees
}

export interface MagnetPosition {
  position: Vector3D // mm
  rotation: Vector3D // degrees
}

// Simulation Parameters
export interface SimulationParams {
  airGap: number // mm
  rpm: number
  temperature: number // °C
  samplesPerRevolution: number
  noiseLevel: number // percentage
}

// Simulation Results
export interface SimulationResult {
  angleError: number[] // degrees
  magneticField: Vector3D[]
  outputSignal: {
    sin: number[]
    cos: number[]
  }
  snr: number
  linearity: number
  maxError: number
  rmsError: number
  // Additional fields for UI
  angleData: {
    mechanicalAngle: number
    electricalAngle: number
    error: number
    sinOutput: number
    cosOutput: number
  }[]
  maxErrorAngle: number
  avgError: number
}

// Complete Configuration
export interface ToolConfiguration {
  sensor: Sensor | null
  sensorPosition: SensorPosition
  magnet: Magnet | null
  magnetPosition: MagnetPosition
  params: SimulationParams
}

// UI State
export type ActiveTab = 'sensor' | 'position' | 'magnet' | 'parameters' | 'results' | 'report'

// Report Data
export interface ReportData {
  title: string
  date: string
  configuration: ToolConfiguration
  results: SimulationResult
  charts: {
    errorPlot: string
    fieldPlot: string
    signalPlot: string
  }
}

// Preset Template
export interface PresetTemplate {
  id: string
  name: string
  description: string
  category: string
  configuration: Partial<ToolConfiguration>
  thumbnail?: string
}

// Comparison Mode
export interface ComparisonConfig {
  id: string
  name: string
  configuration: ToolConfiguration
  results: SimulationResult
}

// Batch Simulation
export interface BatchSimulationJob {
  id: string
  name: string
  configurations: ToolConfiguration[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  results?: SimulationResult[]
}

// 3D Scene Objects
export interface SceneObject {
  id: string
  type: 'sensor' | 'magnet'
  position: Vector3D
  rotation: Vector3D
  visible: boolean
  opacity: number
}

// Field Visualization
export interface FieldVisualizationOptions {
  showFieldLines: boolean
  showFieldVectors: boolean
  showHeatmap: boolean
  vectorDensity: number
  heatmapResolution: number
}
