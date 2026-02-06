import { Sensor, Magnet, PresetTemplate } from '@/types'

// MagAlpha Sensor Family
export const magAlphaSensors: Sensor[] = [
  {
    id: 'ma732',
    name: 'MA732',
    description: '高精度12位磁角度传感器，适用于一般工业应用',
    family: 'magalpha',
    mountType: 'end-of-shaft',
    resolution: 12,
    maxRpm: 60000,
    package: 'QFN-16 (3x3mm)',
    features: ['12-bit resolution', 'High speed', 'Low latency'],
    specs: {
      resolution: '12-bit',
      accuracy: '±0.5°',
      updateRate: '1μs',
      temperature: '-40°C to 125°C'
    }
  },
  {
    id: 'ma734',
    name: 'MA734',
    description: '超高精度14位磁角度传感器，精密控制应用首选',
    family: 'magalpha',
    mountType: 'end-of-shaft',
    resolution: 14,
    maxRpm: 60000,
    package: 'QFN-16 (3x3mm)',
    features: ['14-bit resolution', 'High speed', 'Low latency'],
    specs: {
      resolution: '14-bit',
      accuracy: '±0.1°',
      updateRate: '1μs',
      temperature: '-40°C to 125°C'
    }
  },
  {
    id: 'ma800',
    name: 'MA800',
    description: '侧轴8位传感器，超高速应用专用',
    family: 'magalpha',
    mountType: 'side-shaft',
    resolution: 8,
    maxRpm: 100000,
    package: 'QFN-16 (3x3mm)',
    features: ['8-bit resolution', 'Ultra high speed', 'Side-shaft capable'],
    specs: {
      resolution: '8-bit',
      accuracy: '±1.0°',
      updateRate: '0.5μs',
      temperature: '-40°C to 125°C'
    }
  },
  {
    id: 'ma850',
    name: 'MA850',
    description: '正交侧轴10位传感器，灵活安装方案',
    family: 'magalpha',
    mountType: 'side-shaft-orthogonal',
    resolution: 10,
    maxRpm: 80000,
    package: 'QFN-16 (3x3mm)',
    features: ['10-bit resolution', 'Orthogonal mounting', 'High speed'],
    specs: {
      resolution: '10-bit',
      accuracy: '±0.3°',
      updateRate: '1μs',
      temperature: '-40°C to 125°C'
    }
  },
  {
    id: 'ma600',
    name: 'MA600',
    description: '15位超高精度传感器，精密测量首选',
    family: 'magalpha',
    mountType: 'end-of-shaft',
    resolution: 15,
    maxRpm: 45000,
    package: 'QFN-16 (3x3mm)',
    features: ['15-bit resolution', 'Highest precision', 'End-of-shaft'],
    specs: {
      resolution: '15-bit',
      accuracy: '±0.05°',
      updateRate: '2μs',
      temperature: '-40°C to 125°C'
    }
  }
]

// MagVector Sensor Family
export const magVectorSensors: Sensor[] = [
  {
    id: 'mv200',
    name: 'MV200',
    description: '双轴矢量传感器，2D位置检测',
    family: 'magvector',
    mountType: 'circular',
    resolution: 12,
    maxRpm: 30000,
    package: 'QFN-24 (4x4mm)',
    features: ['2D position sensing', 'Circular magnet support'],
    specs: {
      resolution: '12-bit',
      accuracy: '±0.3°',
      updateRate: '5μs',
      temperature: '-40°C to 105°C'
    }
  },
  {
    id: 'mv300',
    name: 'MV300',
    description: '三轴矢量传感器，3D位置检测',
    family: 'magvector',
    mountType: 'circular',
    resolution: 12,
    maxRpm: 25000,
    package: 'QFN-24 (4x4mm)',
    features: ['3D position sensing', 'Joystick-like control'],
    specs: {
      resolution: '12-bit',
      accuracy: '±0.5°',
      updateRate: '8μs',
      temperature: '-40°C to 105°C'
    }
  },
  {
    id: 'mv100',
    name: 'MV100',
    description: '线性位置传感器，直线位移测量',
    family: 'magvector',
    mountType: 'linear',
    resolution: 10,
    maxRpm: 0,
    package: 'QFN-16 (3x3mm)',
    features: ['Linear position', 'Stroke measurement'],
    specs: {
      resolution: '10-bit',
      accuracy: '±0.5mm',
      updateRate: '10μs',
      temperature: '-40°C to 85°C'
    }
  }
]

// Combined sensor list
export const allSensors: Sensor[] = [...magAlphaSensors, ...magVectorSensors]
export const sensorLibrary = allSensors

// Magnet Library
export const magnetLibrary: Magnet[] = [
  // Cylinder Magnets
  {
    id: 'cyl-6x3-ndfeb',
    name: 'Cylinder 6x3mm NdFeB',
    description: '小型圆柱形钕铁硼磁铁，适用于精密角度测量',
    shape: 'cylinder',
    material: 'ndfeb',
    dimensions: { diameter: 6, height: 3 },
    magnetization: 'diametrical',
    remanence: 1.2,
    temperature: 25
  },
  {
    id: 'cyl-8x5-ndfeb',
    name: 'Cylinder 8x5mm NdFeB',
    description: '中型圆柱形磁铁，通用型角度传感应用',
    shape: 'cylinder',
    material: 'ndfeb',
    dimensions: { diameter: 8, height: 5 },
    magnetization: 'diametrical',
    remanence: 1.25,
    temperature: 25
  },
  {
    id: 'cyl-10x10-ndfeb',
    name: 'Cylinder 10x10mm NdFeB',
    description: '大型圆柱形磁铁，高磁场强度',
    shape: 'cylinder',
    material: 'ndfeb',
    dimensions: { diameter: 10, height: 10 },
    magnetization: 'axial',
    remanence: 1.3,
    temperature: 25
  },
  // Ring Magnets
  {
    id: 'ring-15x8x5-ndfeb',
    name: 'Ring Ø15xØ8x5mm NdFeB',
    description: '环形钕铁硼磁铁，适用于轴端安装',
    shape: 'ring',
    material: 'ndfeb',
    dimensions: { outerDiameter: 15, innerDiameter: 8, height: 5 },
    magnetization: 'diametrical',
    remanence: 1.2,
    temperature: 25
  },
  {
    id: 'ring-20x10x8-smco',
    name: 'Ring Ø20xØ10x8mm SmCo',
    description: '钐钴环形磁铁，高温应用专用',
    shape: 'ring',
    material: 'smco',
    dimensions: { outerDiameter: 20, innerDiameter: 10, height: 8 },
    magnetization: 'radial',
    remanence: 1.0,
    temperature: 150
  },
  // Rectangle Magnets
  {
    id: 'rect-10x5x3-ndfeb',
    name: 'Rectangle 10x5x3mm NdFeB',
    description: '矩形钕铁硼磁铁，线性传感应用',
    shape: 'rectangle',
    material: 'ndfeb',
    dimensions: { length: 10, width: 5, height: 3 },
    magnetization: 'axial',
    remanence: 1.25,
    temperature: 25
  },
  // Arc Magnets
  {
    id: 'arc-30x25x5-90-ndfeb',
    name: 'Arc Ø30xØ25x5mm 90° NdFeB',
    description: '弧形钕铁硼磁铁，多极对应用',
    shape: 'arc',
    material: 'ndfeb',
    dimensions: { outerDiameter: 30, innerDiameter: 25, height: 5, angle: 90 },
    magnetization: 'radial',
    remanence: 1.2,
    temperature: 25
  }
]

// Material Properties
export const materialProperties = {
  ndfeb: {
    name: 'Neodymium Iron Boron',
    maxTemperature: 150,
    typicalRemanence: 1.2,
    density: 7.5,
    description: 'Highest magnetic strength'
  },
  smco: {
    name: 'Samarium Cobalt',
    maxTemperature: 350,
    typicalRemanence: 1.0,
    density: 8.4,
    description: 'High temperature stability'
  },
  alnico: {
    name: 'Aluminum Nickel Cobalt',
    maxTemperature: 540,
    typicalRemanence: 0.8,
    density: 7.3,
    description: 'Good temperature stability'
  },
  ferrite: {
    name: 'Ceramic Ferrite',
    maxTemperature: 250,
    typicalRemanence: 0.4,
    density: 5.0,
    description: 'Cost-effective'
  }
}

// Preset Templates
export const presetTemplates: PresetTemplate[] = [
  {
    id: 'standard-eos',
    name: 'Standard End-of-Shaft',
    description: 'Typical end-of-shaft configuration',
    category: 'Standard',
    configuration: {
      params: { airGap: 2.5, rpm: 3000, temperature: 25, samplesPerRevolution: 360, noiseLevel: 0.1 }
    }
  },
  {
    id: 'side-shaft',
    name: 'Side-Shaft Mounting',
    description: 'Side-shaft sensor configuration',
    category: 'Standard',
    configuration: {
      params: { airGap: 3.0, rpm: 3000, temperature: 25, samplesPerRevolution: 360, noiseLevel: 0.1 }
    }
  },
  {
    id: 'high-speed',
    name: 'High-Speed Motor',
    description: 'Optimized for high-speed motors (50k+ RPM)',
    category: 'High Performance',
    configuration: {
      params: { airGap: 2.0, rpm: 50000, temperature: 80, samplesPerRevolution: 360, noiseLevel: 0.05 }
    }
  },
  {
    id: 'high-precision',
    name: 'High-Precision',
    description: 'Maximum precision configuration',
    category: 'High Performance',
    configuration: {
      params: { airGap: 1.5, rpm: 1000, temperature: 25, samplesPerRevolution: 720, noiseLevel: 0.02 }
    }
  },
  {
    id: 'harsh-environment',
    name: 'Harsh Environment',
    description: 'For extreme temperature applications',
    category: 'Industrial',
    configuration: {
      params: { airGap: 3.5, rpm: 2000, temperature: 150, samplesPerRevolution: 360, noiseLevel: 0.2 }
    }
  },
  {
    id: 'low-cost',
    name: 'Cost-Optimized',
    description: 'Balanced performance and cost',
    category: 'Industrial',
    configuration: {
      params: { airGap: 3.0, rpm: 1000, temperature: 25, samplesPerRevolution: 180, noiseLevel: 0.15 }
    }
  }
]
