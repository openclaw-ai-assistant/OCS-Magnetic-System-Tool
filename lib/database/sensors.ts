import { Sensor, Magnet, PresetTemplate } from '@/types'

// MagAlpha Sensor Family
export const magAlphaSensors: Sensor[] = [
  {
    id: 'ma732',
    name: 'MA732',
    family: 'magalpha',
    mountType: 'end-of-shaft',
    resolution: 12,
    maxRpm: 60000,
    package: 'QFN-16 (3x3mm)',
    features: ['12-bit resolution', 'High speed', 'Low latency']
  },
  {
    id: 'ma734',
    name: 'MA734',
    family: 'magalpha',
    mountType: 'end-of-shaft',
    resolution: 14,
    maxRpm: 60000,
    package: 'QFN-16 (3x3mm)',
    features: ['14-bit resolution', 'High speed', 'Low latency']
  },
  {
    id: 'ma800',
    name: 'MA800',
    family: 'magalpha',
    mountType: 'side-shaft',
    resolution: 8,
    maxRpm: 100000,
    package: 'QFN-16 (3x3mm)',
    features: ['8-bit resolution', 'Ultra high speed', 'Side-shaft capable']
  },
  {
    id: 'ma850',
    name: 'MA850',
    family: 'magalpha',
    mountType: 'side-shaft-orthogonal',
    resolution: 10,
    maxRpm: 80000,
    package: 'QFN-16 (3x3mm)',
    features: ['10-bit resolution', 'Orthogonal mounting', 'High speed']
  },
  {
    id: 'ma600',
    name: 'MA600',
    family: 'magalpha',
    mountType: 'end-of-shaft',
    resolution: 15,
    maxRpm: 30000,
    package: 'QFN-16 (5x5mm)',
    features: ['15-bit resolution', 'High precision', 'Programmable']
  }
]

// MagVector Sensor Family
export const magVectorSensors: Sensor[] = [
  {
    id: 'mv200',
    name: 'MV200',
    family: 'magvector',
    mountType: 'circular',
    resolution: 10,
    maxRpm: 50000,
    package: 'QFN-24 (4x4mm)',
    features: ['Circular motion', '2D position sensing', 'High speed']
  },
  {
    id: 'mv210',
    name: 'MV210',
    family: 'magvector',
    mountType: 'linear',
    resolution: 12,
    maxRpm: 0,
    package: 'QFN-24 (4x4mm)',
    features: ['Linear motion', '1D position sensing', 'High precision']
  },
  {
    id: 'mv300',
    name: 'MV300',
    family: 'magvector',
    mountType: 'circular',
    resolution: 14,
    maxRpm: 40000,
    package: 'QFN-32 (5x5mm)',
    features: ['Circular motion', '3D position sensing', 'Ultra high precision']
  }
]

// All Sensors
export const allSensors: Sensor[] = [...magAlphaSensors, ...magVectorSensors]

// Magnet Library
export const magnetLibrary: Magnet[] = [
  // Cylinder Magnets
  {
    id: 'cyl-6x3-ndfeb',
    name: 'Cylinder 6x3mm NdFeB',
    shape: 'cylinder',
    material: 'ndfeb',
    dimensions: {
      diameter: 6,
      height: 3
    },
    magnetization: 'diametrical',
    remanence: 1.2,
    temperature: 25
  },
  {
    id: 'cyl-8x5-ndfeb',
    name: 'Cylinder 8x5mm NdFeB',
    shape: 'cylinder',
    material: 'ndfeb',
    dimensions: {
      diameter: 8,
      height: 5
    },
    magnetization: 'diametrical',
    remanence: 1.25,
    temperature: 25
  },
  {
    id: 'cyl-10x10-ndfeb',
    name: 'Cylinder 10x10mm NdFeB',
    shape: 'cylinder',
    material: 'ndfeb',
    dimensions: {
      diameter: 10,
      height: 10
    },
    magnetization: 'axial',
    remanence: 1.3,
    temperature: 25
  },
  // Ring Magnets
  {
    id: 'ring-15x8x5-ndfeb',
    name: 'Ring Ø15xØ8x5mm NdFeB',
    shape: 'ring',
    material: 'ndfeb',
    dimensions: {
      outerDiameter: 15,
      innerDiameter: 8,
      height: 5
    },
    magnetization: 'diametrical',
    remanence: 1.2,
    temperature: 25
  },
  {
    id: 'ring-20x10x8-smco',
    name: 'Ring Ø20xØ10x8mm SmCo',
    shape: 'ring',
    material: 'smco',
    dimensions: {
      outerDiameter: 20,
      innerDiameter: 10,
      height: 8
    },
    magnetization: 'radial',
    remanence: 1.0,
    temperature: 150
  },
  // Rectangle Magnets
  {
    id: 'rect-10x5x3-ndfeb',
    name: 'Rectangle 10x5x3mm NdFeB',
    shape: 'rectangle',
    material: 'ndfeb',
    dimensions: {
      length: 10,
      width: 5,
      height: 3
    },
    magnetization: 'axial',
    remanence: 1.25,
    temperature: 25
  },
  // Arc Magnets
  {
    id: 'arc-30x25x5-90-ndfeb',
    name: 'Arc Ø30xØ25x5mm 90° NdFeB',
    shape: 'arc',
    material: 'ndfeb',
    dimensions: {
      outerDiameter: 30,
      innerDiameter: 25,
      height: 5,
      angle: 90
    },
    magnetization: 'radial',
    remanence: 1.2,
    temperature: 25
  }
]

// Material Properties
export const materialProperties = {
  ndfeb: {
    name: 'Neodymium (NdFeB)',
    remanenceRange: [1.0, 1.4],
    maxTemperature: 80,
    coercivity: 'High'
  },
  smco: {
    name: 'Samarium Cobalt (SmCo)',
    remanenceRange: [0.8, 1.1],
    maxTemperature: 250,
    coercivity: 'Very High'
  },
  alnico: {
    name: 'Alnico',
    remanenceRange: [0.6, 1.4],
    maxTemperature: 450,
    coercivity: 'Low'
  },
  ferrite: {
    name: 'Ferrite (Ceramic)',
    remanenceRange: [0.3, 0.4],
    maxTemperature: 250,
    coercivity: 'Medium'
  }
}

// Preset Templates
export const presetTemplates: PresetTemplate[] = [
  {
    id: 'preset-1',
    name: 'Standard End-of-Shaft',
    description: 'Typical end-of-shaft configuration with cylinder magnet',
    category: 'Common',
    configuration: {
      sensor: magAlphaSensors[0],
      sensorPosition: {
        position: { x: 0, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnet: magnetLibrary[1],
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
  },
  {
    id: 'preset-2',
    name: 'High-Speed Motor',
    description: 'Optimized for high-speed motor applications',
    category: 'Motor Control',
    configuration: {
      sensor: magAlphaSensors[2],
      sensorPosition: {
        position: { x: 3, y: 0, z: 0 },
        rotation: { x: 0, y: 90, z: 0 }
      },
      magnet: magnetLibrary[3],
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: {
        airGap: 1.5,
        rpm: 50000,
        temperature: 60,
        samplesPerRevolution: 720,
        noiseLevel: 0.05
      }
    }
  },
  {
    id: 'preset-3',
    name: 'Linear Position',
    description: 'Linear motion sensing with rectangular magnet',
    category: 'Position Sensing',
    configuration: {
      sensor: magVectorSensors[1],
      sensorPosition: {
        position: { x: 0, y: 0, z: 3 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnet: magnetLibrary[5],
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: {
        airGap: 3,
        rpm: 0,
        temperature: 25,
        samplesPerRevolution: 100,
        noiseLevel: 0.08
      }
    }
  },
  {
    id: 'preset-4',
    name: 'High Precision',
    description: 'Maximum precision configuration for industrial applications',
    category: 'Industrial',
    configuration: {
      sensor: magAlphaSensors[4],
      sensorPosition: {
        position: { x: 0, y: 0, z: 1.5 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      magnet: magnetLibrary[2],
      magnetPosition: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      params: {
        airGap: 1.5,
        rpm: 3000,
        temperature: 25,
        samplesPerRevolution: 1440,
        noiseLevel: 0.02
      }
    }
  }
]
