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

// Enhanced Preset Templates
export const presetTemplates: PresetTemplate[] = [
  // 标准配置
  {
    id: 'standard-eos',
    name: '标准轴端安装',
    description: '最常见的轴端传感器配置，适用于一般工业应用',
    category: '标准配置',
    icon: '⚙️',
    configuration: {
      sensor: magAlphaSensors[0], // MA732
      magnet: magnetLibrary[1], // cyl-8x5-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 2.5 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.5, rpm: 3000, temperature: 25, samplesPerRevolution: 360, noiseLevel: 0.1 }
    }
  },
  {
    id: 'standard-side',
    name: '标准侧轴安装',
    description: '侧轴传感器配置，适合空间受限的应用',
    category: '标准配置',
    icon: '📐',
    configuration: {
      sensor: magAlphaSensors[2], // MA800
      magnet: magnetLibrary[1], // cyl-8x5-ndfeb
      sensorPosition: {
        position: { x: 6, y: 0, z: 0 },
        rotation: { x: 0, y: 90, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 3.0, rpm: 3000, temperature: 25, samplesPerRevolution: 360, noiseLevel: 0.1 }
    }
  },
  
  // 高性能配置
  {
    id: 'high-precision',
    name: '高精度测量',
    description: '15位超高精度，适合精密仪器和测量设备',
    category: '高性能',
    icon: '🎯',
    configuration: {
      sensor: magAlphaSensors[4], // MA600
      magnet: magnetLibrary[2], // cyl-10x10-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 1.5 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 1.5, rpm: 1000, temperature: 25, samplesPerRevolution: 720, noiseLevel: 0.02 }
    }
  },
  {
    id: 'high-speed',
    name: '高速电机应用',
    description: '优化用于50000+ RPM的高速电机控制',
    category: '高性能',
    icon: '⚡',
    configuration: {
      sensor: magAlphaSensors[2], // MA800
      magnet: magnetLibrary[1], // cyl-8x5-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.0, rpm: 50000, temperature: 80, samplesPerRevolution: 360, noiseLevel: 0.05 }
    }
  },
  
  // 行业应用
  {
    id: 'servo-motor',
    name: '伺服电机控制',
    description: '工业伺服系统标准配置，平衡性能和成本',
    category: '行业应用',
    icon: '🤖',
    configuration: {
      sensor: magAlphaSensors[1], // MA734
      magnet: magnetLibrary[1], // cyl-8x5-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.0, rpm: 6000, temperature: 60, samplesPerRevolution: 360, noiseLevel: 0.08 }
    }
  },
  {
    id: 'robot-joint',
    name: '机器人关节',
    description: '协作机器人关节专用，高可靠性和精度',
    category: '行业应用',
    icon: '🦾',
    configuration: {
      sensor: magAlphaSensors[3], // MA850 (侧轴正交安装)
      magnet: magnetLibrary[3], // ring-15x8x5-ndfeb
      sensorPosition: {
        position: { x: 8, y: 0, z: 0 },
        rotation: { x: 0, y: 90, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.5, rpm: 2000, temperature: 50, samplesPerRevolution: 360, noiseLevel: 0.05 }
    }
  },
  {
    id: 'drone-gimbal',
    name: '无人机云台',
    description: '轻量化设计，适合无人机稳定器应用',
    category: '行业应用',
    icon: '🚁',
    configuration: {
      sensor: magAlphaSensors[0], // MA732
      magnet: magnetLibrary[0], // cyl-6x3-ndfeb (小型)
      sensorPosition: {
        position: { x: 0, y: 0, z: 1.8 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 1.8, rpm: 100, temperature: 40, samplesPerRevolution: 360, noiseLevel: 0.1 }
    }
  },
  {
    id: 'automotive-eps',
    name: '汽车电动助力转向',
    description: '汽车EPS系统专用，高可靠性和宽温度范围',
    category: '行业应用',
    icon: '🚗',
    configuration: {
      sensor: magAlphaSensors[1], // MA734
      magnet: magnetLibrary[3], // ring-15x8x5-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 2.5 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.5, rpm: 600, temperature: 85, samplesPerRevolution: 360, noiseLevel: 0.1 }
    }
  },
  {
    id: 'encoder-industrial',
    name: '工业编码器',
    description: '替代光电编码器的磁编码方案，抗污染能力强',
    category: '行业应用',
    icon: '🏭',
    configuration: {
      sensor: magAlphaSensors[1], // MA734
      magnet: magnetLibrary[3], // ring-15x8x5-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.0, rpm: 3000, temperature: 70, samplesPerRevolution: 360, noiseLevel: 0.08 }
    }
  },
  
  // 特殊环境
  {
    id: 'harsh-temp',
    name: '高温环境应用',
    description: '150°C高温环境，使用钐钴磁铁',
    category: '特殊环境',
    icon: '🔥',
    configuration: {
      sensor: magAlphaSensors[1], // MA734
      magnet: magnetLibrary[4], // ring-20x10x8-smco
      sensorPosition: {
        position: { x: 0, y: 0, z: 3.0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 3.0, rpm: 2000, temperature: 150, samplesPerRevolution: 360, noiseLevel: 0.15 }
    }
  },
  {
    id: 'low-cost',
    name: '成本优化方案',
    description: '平衡性能和成本的经济型配置',
    category: '特殊环境',
    icon: '💰',
    configuration: {
      sensor: magAlphaSensors[0], // MA732
      magnet: magnetLibrary[0], // cyl-6x3-ndfeb
      sensorPosition: {
        position: { x: 0, y: 0, z: 3.0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 3.0, rpm: 1000, temperature: 25, samplesPerRevolution: 180, noiseLevel: 0.15 }
    }
  },
  {
    id: 'linear-position',
    name: '线性位置检测',
    description: '使用MagVector传感器进行直线位移测量',
    category: '特殊环境',
    icon: '📏',
    configuration: {
      sensor: magVectorSensors[2], // MV100
      magnet: magnetLibrary[5], // rect-10x5x3-ndfeb
      sensorPosition: {
        position: { x: 0, y: 2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: { airGap: 2.0, rpm: 0, temperature: 25, samplesPerRevolution: 100, noiseLevel: 0.1 }
    }
  }
]

// Get templates by category
export const getTemplatesByCategory = () => {
  const categories: Record<string, PresetTemplate[]> = {}
  
  presetTemplates.forEach(template => {
    if (!categories[template.category]) {
      categories[template.category] = []
    }
    categories[template.category].push(template)
  })
  
  return categories
}

// Search templates
export const searchTemplates = (query: string): PresetTemplate[] => {
  const lowerQuery = query.toLowerCase()
  return presetTemplates.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery)
  )
}
