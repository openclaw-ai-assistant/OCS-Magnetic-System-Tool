import { ToolConfiguration, SimulationResult, Vector3D } from '@/types'

// Magnetic constant
const MU_0 = 4 * Math.PI * 1e-7 // H/m

// Calculate magnetic field from a dipole at a point
export function calculateMagneticField(
  point: Vector3D,
  magnetPosition: Vector3D,
  magnetRotation: Vector3D,
  remanence: number,
  volume: number
): Vector3D {
  // Transform point to magnet's local coordinate system
  const localPoint = transformPointToLocal(point, magnetPosition, magnetRotation)
  
  // Distance from magnet center
  const r = Math.sqrt(localPoint.x ** 2 + localPoint.y ** 2 + localPoint.z ** 2)
  
  if (r < 0.1) {
    // Avoid singularity
    return { x: 0, y: 0, z: remanence * 1e6 }
  }
  
  // Magnetic moment (assuming magnetization along z-axis)
  const m = remanence * volume / MU_0
  
  // Dipole field calculation
  const r3 = r ** 3
  const r5 = r ** 5
  
  // Dot product m·r (m is along z-axis in local coordinates)
  const mDotR = m * localPoint.z
  
  const Bx = (MU_0 / (4 * Math.PI)) * (3 * mDotR * localPoint.x / r5)
  const By = (MU_0 / (4 * Math.PI)) * (3 * mDotR * localPoint.y / r5)
  const Bz = (MU_0 / (4 * Math.PI)) * ((3 * mDotR * localPoint.z / r5) - (m / r3))
  
  // Transform back to global coordinates
  return transformVectorToGlobal({ x: Bx, y: By, z: Bz }, magnetRotation)
}

// Transform point to local coordinate system
function transformPointToLocal(
  point: Vector3D,
  origin: Vector3D,
  rotation: Vector3D
): Vector3D {
  // Translate
  const translated = {
    x: point.x - origin.x,
    y: point.y - origin.y,
    z: point.z - origin.z
  }
  
  // Rotate (simplified - using ZYX rotation order)
  const cx = Math.cos(rotation.x * Math.PI / 180)
  const sx = Math.sin(rotation.x * Math.PI / 180)
  const cy = Math.cos(rotation.y * Math.PI / 180)
  const sy = Math.sin(rotation.y * Math.PI / 180)
  const cz = Math.cos(rotation.z * Math.PI / 180)
  const sz = Math.sin(rotation.z * Math.PI / 180)
  
  // Apply inverse rotation
  const x = translated.x * (cy * cz) + translated.y * (cy * sz) + translated.z * (-sy)
  const y = translated.x * (sx * sy * cz - cx * sz) + translated.y * (sx * sy * sz + cx * cz) + translated.z * (sx * cy)
  const z = translated.x * (cx * sy * cz + sx * sz) + translated.y * (cx * sy * sz - sx * cz) + translated.z * (cx * cy)
  
  return { x, y, z }
}

// Transform vector to global coordinate system
function transformVectorToGlobal(vector: Vector3D, rotation: Vector3D): Vector3D {
  const cx = Math.cos(rotation.x * Math.PI / 180)
  const sx = Math.sin(rotation.x * Math.PI / 180)
  const cy = Math.cos(rotation.y * Math.PI / 180)
  const sy = Math.sin(rotation.y * Math.PI / 180)
  const cz = Math.cos(rotation.z * Math.PI / 180)
  const sz = Math.sin(rotation.z * Math.PI / 180)
  
  const x = vector.x * (cy * cz) + vector.y * (cx * sz + sx * sy * cz) + vector.z * (sx * sz - cx * sy * cz)
  const y = vector.x * (-cy * sz) + vector.y * (cx * cz - sx * sy * sz) + vector.z * (sx * cz + cx * sy * sz)
  const z = vector.x * sy + vector.y * (-sx * cy) + vector.z * (cx * cy)
  
  return { x, y, z }
}

// Calculate magnet volume
export function calculateMagnetVolume(magnet: any): number {
  if (!magnet) return 1e-9
  
  const dims = magnet.dimensions
  switch (magnet.shape) {
    case 'cylinder':
      return Math.PI * (dims.diameter! / 2) ** 2 * dims.height! * 1e-9 // Convert to m³
    case 'ring':
      return Math.PI * ((dims.outerDiameter! / 2) ** 2 - (dims.innerDiameter! / 2) ** 2) * dims.height! * 1e-9
    case 'rectangle':
      return dims.length! * dims.width! * dims.height! * 1e-9
    case 'arc':
      const angleRad = (dims.angle || 360) * Math.PI / 180
      return angleRad * ((dims.outerDiameter! / 2) ** 2 - (dims.innerDiameter! / 2) ** 2) * dims.height! * 1e-9 / (2 * Math.PI)
    default:
      return 1e-9
  }
}

// Simulate sensor output
export function simulateSensorOutput(
  configuration: ToolConfiguration,
  onProgress?: (progress: number) => void
): Promise<SimulationResult> {
  return new Promise((resolve) => {
    const { sensor, sensorPosition, magnet, magnetPosition, params } = configuration
    
    if (!sensor || !magnet) {
      resolve(createEmptyResult())
      return
    }
    
    const samples = params.samplesPerRevolution
    const angleStep = 360 / samples
    const volume = calculateMagnetVolume(magnet)
    
    const angleError: number[] = []
    const magneticField: Vector3D[] = []
    const sinSignal: number[] = []
    const cosSignal: number[] = []
    
    let maxError = 0
    let sumSquaredError = 0
    
    // Simulate for one revolution
    for (let i = 0; i < samples; i++) {
      const trueAngle = i * angleStep
      const trueAngleRad = trueAngle * Math.PI / 180
      
      // Rotate magnet
      const rotatedMagnetPos = {
        ...magnetPosition,
        rotation: {
          x: magnetPosition.rotation.x,
          y: magnetPosition.rotation.y,
          z: magnetPosition.rotation.z + trueAngle
        }
      }
      
      // Calculate field at sensor position
      const field = calculateMagneticField(
        sensorPosition.position,
        rotatedMagnetPos.position,
        rotatedMagnetPos.rotation,
        magnet.remanence,
        volume
      )
      
      magneticField.push(field)
      
      // Calculate angle from field (simplified model)
      const measuredAngleRad = Math.atan2(field.y, field.x)
      let measuredAngle = measuredAngleRad * 180 / Math.PI
      
      // Add noise
      const noise = (Math.random() - 0.5) * 2 * params.noiseLevel
      measuredAngle += noise
      
      // Normalize angle
      if (measuredAngle < 0) measuredAngle += 360
      
      // Calculate error
      let error = measuredAngle - trueAngle
      if (error > 180) error -= 360
      if (error < -180) error += 360
      
      angleError.push(error)
      
      // Update statistics
      maxError = Math.max(maxError, Math.abs(error))
      sumSquaredError += error ** 2
      
      // Generate output signals
      const signalGain = 1 / (1 + params.airGap * 0.1) // Signal decreases with air gap
      sinSignal.push(Math.sin(trueAngleRad) * signalGain + noise * 0.1)
      cosSignal.push(Math.cos(trueAngleRad) * signalGain + noise * 0.1)
      
      // Report progress
      if (onProgress && i % 10 === 0) {
        onProgress((i / samples) * 100)
      }
    }
    
    // Calculate final statistics
    const rmsError = Math.sqrt(sumSquaredError / samples)
    const signalPower = sinSignal.reduce((sum, s) => sum + s ** 2, 0) / samples +
                       cosSignal.reduce((sum, c) => sum + c ** 2, 0) / samples
    const noisePower = (params.noiseLevel / 100) ** 2
    const snr = 10 * Math.log10(signalPower / (noisePower + 1e-10))
    
    // Calculate linearity (max deviation from best fit line)
    const linearity = calculateLinearity(angleError)
    
    // Find max error angle
    let maxErrorAngle = 0
    let maxAbsError = 0
    angleError.forEach((error, idx) => {
      const absError = Math.abs(error)
      if (absError > maxAbsError) {
        maxAbsError = absError
        maxErrorAngle = idx * angleStep
      }
    })
    
    // Calculate average error
    const avgError = angleError.reduce((sum, e) => sum + Math.abs(e), 0) / samples
    
    // Build angle data array
    const angleData = angleError.map((error, idx) => ({
      mechanicalAngle: idx * angleStep,
      electricalAngle: (idx * angleStep) % 360,
      error: error,
      sinOutput: sinSignal[idx],
      cosOutput: cosSignal[idx]
    }))
    
    resolve({
      angleError,
      magneticField,
      outputSignal: { sin: sinSignal, cos: cosSignal },
      snr,
      linearity,
      maxError,
      rmsError,
      angleData,
      maxErrorAngle,
      avgError
    })
  })
}

// Calculate linearity
function calculateLinearity(errors: number[]): number {
  if (errors.length === 0) return 0
  
  // Simple linearity: max deviation from mean error
  const meanError = errors.reduce((sum, e) => sum + e, 0) / errors.length
  const maxDeviation = Math.max(...errors.map(e => Math.abs(e - meanError)))
  
  return maxDeviation
}

// Create empty result
function createEmptyResult(): SimulationResult {
  return {
    angleError: [],
    magneticField: [],
    outputSignal: { sin: [], cos: [] },
    snr: 0,
    linearity: 0,
    maxError: 0,
    rmsError: 0,
    angleData: [],
    maxErrorAngle: 0,
    avgError: 0
  }
}

// Single simulation with progress tracking
export async function runSimulation(
  configuration: ToolConfiguration,
  onProgress?: (progress: number) => void
): Promise<SimulationResult> {
  return simulateSensorOutput(configuration, onProgress)
}

// Batch simulation
export async function runBatchSimulation(
  configurations: ToolConfiguration[],
  onProgress?: (jobProgress: number, totalProgress: number) => void
): Promise<SimulationResult[]> {
  const results: SimulationResult[] = []
  
  for (let i = 0; i < configurations.length; i++) {
    const result = await simulateSensorOutput(configurations[i], (progress) => {
      if (onProgress) {
        const totalProgress = ((i + progress / 100) / configurations.length) * 100
        onProgress(progress, totalProgress)
      }
    })
    results.push(result)
  }
  
  return results
}
