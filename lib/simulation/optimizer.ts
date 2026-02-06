import { ToolConfiguration, SimulationResult } from '@/types'
import { runSimulation } from './magnetic-field'

export interface OptimizationResult {
  best: {
    configuration: ToolConfiguration
    result: SimulationResult
  }
  original: number
  allResults: Array<{
    configuration: ToolConfiguration
    result: SimulationResult
    error: number
  }>
}

export async function runOptimization(
  baseConfig: ToolConfiguration,
  type: 'airgap' | 'position' | 'full' = 'airgap',
  targetMetric: 'maxError' | 'avgError' = 'maxError',
  onProgress?: (progress: number, currentResult?: any) => void
): Promise<OptimizationResult> {
  // 获取原始结果
  const originalResult = await runSimulation(baseConfig)
  const originalError = originalResult[targetMetric]
  
  let bestConfig = { ...baseConfig }
  let bestResult = originalResult
  let bestError = originalError
  
  const allResults: OptimizationResult['allResults'] = []
  
  // 根据优化类型定义扫描范围
  const configsToTest: ToolConfiguration[] = []
  
  if (type === 'airgap' || type === 'full') {
    // 扫描气隙 0.5mm - 5mm
    for (let airGap = 0.5; airGap <= 5; airGap += 0.5) {
      configsToTest.push({
        ...baseConfig,
        params: { ...baseConfig.params, airGap }
      })
    }
  }
  
  if (type === 'position' || type === 'full') {
    // 扫描XY位置 -2mm 到 +2mm
    const positions = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]
    for (const x of positions) {
      for (const y of positions) {
        configsToTest.push({
          ...baseConfig,
          sensorPosition: {
            ...baseConfig.sensorPosition,
            position: {
              ...baseConfig.sensorPosition.position,
              x: baseConfig.sensorPosition.position.x + x,
              y: baseConfig.sensorPosition.position.y + y
            }
          }
        })
      }
    }
  }
  
  const totalConfigs = configsToTest.length
  
  // 测试所有配置
  for (let i = 0; i < totalConfigs; i++) {
    const config = configsToTest[i]
    const result = await runSimulation(config)
    const error = result[targetMetric]
    
    allResults.push({
      configuration: config,
      result,
      error
    })
    
    // 更新最佳配置
    if (error < bestError) {
      bestError = error
      bestConfig = config
      bestResult = result
    }
    
    // 报告进度
    const progress = ((i + 1) / totalConfigs) * 100
    if (onProgress) {
      onProgress(progress, {
        iteration: i + 1,
        error,
        bestError
      })
    }
  }
  
  return {
    best: {
      configuration: bestConfig,
      result: bestResult
    },
    original: originalError,
    allResults
  }
}

// 快速优化 - 只扫描关键点
export async function quickOptimize(
  baseConfig: ToolConfiguration,
  targetMetric: 'maxError' | 'avgError' = 'maxError'
): Promise<OptimizationResult> {
  const originalResult = await runSimulation(baseConfig)
  const originalError = originalResult[targetMetric]
  
  let bestConfig = { ...baseConfig }
  let bestResult = originalResult
  let bestError = originalError
  
  const allResults: OptimizationResult['allResults'] = []
  
  // 快速扫描：只测试几个关键气隙值
  const airGaps = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0]
  
  for (const airGap of airGaps) {
    const config = {
      ...baseConfig,
      params: { ...baseConfig.params, airGap }
    }
    
    const result = await runSimulation(config)
    const error = result[targetMetric]
    
    allResults.push({ configuration: config, result, error })
    
    if (error < bestError) {
      bestError = error
      bestConfig = config
      bestResult = result
    }
  }
  
  return {
    best: { configuration: bestConfig, result: bestResult },
    original: originalError,
    allResults
  }
}
