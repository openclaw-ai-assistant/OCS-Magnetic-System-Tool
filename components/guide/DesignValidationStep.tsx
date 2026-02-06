'use client'

import { useMemo } from 'react'
import { useToolStore } from '@/store/toolStore'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Shield,
  Magnet,
  Thermometer,
  Gauge,
  Settings
} from 'lucide-react'

interface ValidationResult {
  id: string
  title: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  recommendation?: string
  icon: any
}

export default function DesignValidationCheck() {
  const { configuration, simulationResult } = useToolStore()
  const { sensor, magnet, sensorPosition, magnetPosition, params } = configuration

  const validations = useMemo<ValidationResult[]>(() => {
    const results: ValidationResult[] = []
    
    // 1. 检查传感器是否选择
    results.push({
      id: 'sensor-selected',
      title: '传感器选择',
      status: sensor ? 'pass' : 'fail',
      message: sensor ? `已选择: ${sensor.name}` : '未选择传感器',
      recommendation: sensor ? undefined : '请从传感器库中选择一个型号',
      icon: Settings
    })

    // 2. 检查磁铁是否选择
    results.push({
      id: 'magnet-selected',
      title: '磁铁选择',
      status: magnet ? 'pass' : 'fail',
      message: magnet ? `已选择: ${magnet.name}` : '未选择磁铁',
      recommendation: magnet ? undefined : '请从磁铁库中选择一个型号',
      icon: Magnet
    })

    // 3. 检查磁场强度
    if (sensor && magnet) {
      const dx = sensorPosition.position.x - magnetPosition.position.x
      const dy = sensorPosition.position.y - magnetPosition.position.y
      const dz = sensorPosition.position.z - magnetPosition.position.z
      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
      const fieldStrength = (magnet.remanence / (distance * distance + 0.1)) * 1000

      let fieldStatus: 'pass' | 'warning' | 'fail' = 'pass'
      let fieldMsg = `场强: ${fieldStrength.toFixed(1)} mT`
      let fieldRec: string | undefined

      if (fieldStrength < 10) {
        fieldStatus = 'fail'
        fieldRec = '磁场强度过低，建议减小气隙或更换更强磁铁'
      } else if (fieldStrength < 20) {
        fieldStatus = 'warning'
        fieldRec = '磁场强度偏低，可能影响测量精度'
      }

      results.push({
        id: 'field-strength',
        title: '磁场强度检查',
        status: fieldStatus,
        message: fieldMsg,
        recommendation: fieldRec,
        icon: Magnet
      })
    }

    // 4. 检查气隙范围
    const airGap = params.airGap
    let gapStatus: 'pass' | 'warning' | 'fail' = 'pass'
    let gapMsg = `气隙: ${airGap} mm`
    let gapRec: string | undefined

    if (airGap < 0.5) {
      gapStatus = 'fail'
      gapRec = '气隙过小，可能导致机械碰撞'
    } else if (airGap > 5) {
      gapStatus = 'warning'
      gapRec = '气隙较大，需要更强磁铁或更高灵敏度传感器'
    } else if (airGap > 3) {
      gapStatus = 'warning'
      gapRec = '建议气隙保持在3mm以内以获得最佳精度'
    }

    results.push({
      id: 'air-gap',
      title: '气隙范围检查',
      status: gapStatus,
      message: gapMsg,
      recommendation: gapRec,
      icon: Settings
    })

    // 5. 检查温度范围
    const temp = params.temperature
    const sensorTemp = sensor?.specs?.temperature || '-40°C to 125°C'
    
    let tempStatus: 'pass' | 'warning' = 'pass'
    let tempMsg = `工作温度: ${temp}°C (传感器支持: ${sensorTemp})`
    let tempRec: string | undefined

    if (temp > 125 || temp < -40) {
      tempStatus = 'warning'
      tempRec = '工作温度超出传感器标称范围，可能需要选择高温型号'
    }

    results.push({
      id: 'temperature',
      title: '温度范围检查',
      status: tempStatus,
      message: tempMsg,
      recommendation: tempRec,
      icon: Thermometer
    })

    // 6. 检查转速
    if (sensor) {
      const rpm = params.rpm
      const maxRpm = sensor.maxRpm
      
      let rpmStatus: 'pass' | 'warning' | 'fail' = 'pass'
      let rpmMsg = `转速: ${rpm} RPM (最大支持: ${maxRpm} RPM)`
      let rpmRec: string | undefined

      if (rpm > maxRpm) {
        rpmStatus = 'fail'
        rpmRec = `转速超出传感器极限，请选择支持更高转速的型号`
      } else if (rpm > maxRpm * 0.8) {
        rpmStatus = 'warning'
        rpmRec = '转速接近传感器极限，建议留有余量'
      }

      results.push({
        id: 'rpm-check',
        title: '转速检查',
        status: rpmStatus,
        message: rpmMsg,
        recommendation: rpmRec,
        icon: Gauge
      })
    }

    // 7. 检查仿真结果
    if (simulationResult) {
      const maxError = simulationResult.maxError
      
      let errorStatus: 'pass' | 'warning' | 'fail' = 'pass'
      let errorMsg = `最大角度误差: ${maxError.toFixed(2)}°`
      let errorRec: string | undefined

      if (maxError > 1.0) {
        errorStatus = 'fail'
        errorRec = '误差过大，建议优化配置或选择更高精度传感器'
      } else if (maxError > 0.5) {
        errorStatus = 'warning'
        errorRec = '误差偏高，可尝试自动优化功能改善'
      }

      results.push({
        id: 'error-check',
        title: '仿真精度检查',
        status: errorStatus,
        message: errorMsg,
        recommendation: errorRec,
        icon: Shield
      })
    }

    // 8. 检查传感器与磁铁匹配
    if (sensor && magnet) {
      const mountType = sensor.mountType
      const magnetShape = magnet.shape
      
      let matchStatus: 'pass' | 'warning' = 'pass'
      let matchMsg = `安装方式: ${mountType}, 磁铁形状: ${magnetShape}`
      let matchRec: string | undefined

      if (mountType === 'end-of-shaft' && magnetShape !== 'cylinder' && magnetShape !== 'ring') {
        matchStatus = 'warning'
        matchRec = '轴端安装建议使用圆柱或环形磁铁'
      } else if (mountType === 'side-shaft' && magnetShape === 'ring') {
        matchStatus = 'warning'
        matchRec = '侧轴安装使用环形磁铁可能影响信号质量'
      }

      results.push({
        id: 'compatibility',
        title: '传感器与磁铁匹配',
        status: matchStatus,
        message: matchMsg,
        recommendation: matchRec,
        icon: Info
      })
    }

    return results
  }, [configuration, simulationResult])

  const passCount = validations.filter(v => v.status === 'pass').length
  const warningCount = validations.filter(v => v.status === 'warning').length
  const failCount = validations.filter(v => v.status === 'fail').length
  const totalCount = validations.length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={20} className="text-green-500" />
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" />
      case 'fail':
        return <XCircle size={20} className="text-red-500" />
      default:
        return null
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-500/10 border-green-500/30'
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30'
      case 'fail':
        return 'bg-red-500/10 border-red-500/30'
      default:
        return 'bg-slate-800 border-slate-700'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Shield className="text-blue-400" />
          设计验证检查
        </h2>
        <p className="text-slate-400">自动检查配置合理性和潜在问题</p>
      </div>

      {/* 总体状态 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">验证结果概览</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-slate-400">通过: {passCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <span className="text-sm text-slate-400">警告: {warningCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm text-slate-400">错误: {failCount}</span>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-green-500 transition-all" 
            style={{ width: `${(passCount / totalCount) * 100}%` }}
          />
          <div 
            className="h-full bg-amber-500 transition-all" 
            style={{ width: `${(warningCount / totalCount) * 100}%` }}
          />
          <div 
            className="h-full bg-red-500 transition-all" 
            style={{ width: `${(failCount / totalCount) * 100}%` }}
          />
        </div>

        {/* 总体评价 */}
        <div className="mt-4 text-center">
          {failCount === 0 && warningCount === 0 ? (
            <div className="text-green-400 font-medium">
              ✅ 所有检查通过，配置合理！
            </div>
          ) : failCount === 0 ? (
            <div className="text-amber-400 font-medium">
              ⚠️ 存在 {warningCount} 个警告，建议优化
            </div>
          ) : (
            <div className="text-red-400 font-medium">
              ❌ 存在 {failCount} 个错误，请修正后再继续
            </div>
          )}
        </div>
      </div>

      {/* 详细检查列表 */}
      <div className="space-y-3">
        {validations.map((validation) => {
          const IconComponent = validation.icon
          return (
            <div 
              key={validation.id}
              className={`p-4 rounded-xl border-2 transition-all ${getStatusBg(validation.status)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getStatusIcon(validation.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent size={16} className="text-slate-400" />
                    <h4 className="font-medium">{validation.title}</h4>
                  </div>
                  <p className="text-sm text-slate-300">{validation.message}</p>
                  {validation.recommendation && (
                    <div className="mt-2 text-sm text-slate-400 bg-black/20 rounded-lg p-2">
                      💡 {validation.recommendation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 提示信息 */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info size={18} className="text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-400">
            <p className="font-medium mb-1">检查说明</p>
            <p>本检查基于工程经验和通用规范，实际应用时请参考具体器件数据手册和实际测试。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
