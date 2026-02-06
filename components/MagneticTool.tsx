'use client'

import { useState, useEffect } from 'react'
import { useToolStore } from '@/store/toolStore'
import StepIndicator from '@/components/guide/StepIndicator'
import SensorStep from '@/components/guide/SensorStep'
import MagnetStep from '@/components/guide/MagnetStep'
import PositionStep from '@/components/guide/PositionStep'
import SimulationStep from '@/components/guide/SimulationStep'
import ResultsStep from '@/components/guide/ResultsStep'
import Canvas3D from '@/components/layout/Canvas3D'
import { Toaster } from 'react-hot-toast'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

export type WizardStep = 'sensor' | 'magnet' | 'position' | 'simulation' | 'results'

export default function MagneticTool() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('sensor')
  const [showPreview, setShowPreview] = useState(true)
  const { configuration, isSimulating, simulationResult, resetConfiguration } = useToolStore()

  const steps: { id: WizardStep; title: string; description: string }[] = [
    { id: 'sensor', title: '选择传感器', description: '选择磁传感器型号' },
    { id: 'magnet', title: '选择磁铁', description: '选择或自定义磁铁' },
    { id: 'position', title: '配置位置', description: '调整传感器和磁铁位置' },
    { id: 'simulation', title: '运行仿真', description: '执行磁场计算' },
    { id: 'results', title: '查看结果', description: '分析仿真数据' },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'sensor':
        return configuration.sensor !== null
      case 'magnet':
        return configuration.magnet !== null
      case 'position':
        return true
      case 'simulation':
        return simulationResult !== null
      default:
        return true
    }
  }

  const goToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const goToStep = (stepId: WizardStep) => {
    const targetIndex = steps.findIndex(s => s.id === stepId)
    // 只允许跳转到已完成或当前步骤的下一步
    if (targetIndex <= currentStepIndex + 1) {
      setCurrentStep(stepId)
    }
  }

  const restart = () => {
    resetConfiguration()
    setCurrentStep('sensor')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'sensor':
        return <SensorStep onComplete={goToNext} />
      case 'magnet':
        return <MagnetStep onComplete={goToNext} />
      case 'position':
        return <PositionStep onComplete={goToNext} />
      case 'simulation':
        return <SimulationStep onComplete={goToNext} />
      case 'results':
        return <ResultsStep onRestart={restart} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold">OCS</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Magnetic System Tool
            </h1>
            <p className="text-xs text-slate-400">磁传感器仿真设计平台</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              showPreview ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {showPreview ? '隐藏预览' : '显示预览'}
          </button>
          <button
            onClick={restart}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            重新开始
          </button>
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Step Content */}
        <div className="w-[450px] bg-slate-900/50 border-r border-slate-700/50 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/80">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                <ChevronLeft size={18} />
                上一步
              </button>

              <span className="text-sm text-slate-500">
                {currentStepIndex + 1} / {steps.length}
              </span>

              {currentStep !== 'results' && (
                <button
                  onClick={goToNext}
                  disabled={!canProceed() || isSimulating}
                  className="flex items-center gap-2 px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                >
                  {currentStep === 'simulation' ? '查看结果' : '下一步'}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - 3D Preview */}
        {showPreview && (
          <div className="flex-1 relative bg-gradient-to-br from-slate-950 to-slate-900">
            <Canvas3D />
            
            {/* Info Overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-sm font-semibold mb-2">当前配置</h3>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  传感器: {configuration.sensor?.name || '未选择'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  磁铁: {configuration.magnet?.name || '未选择'}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${simulationResult ? 'bg-purple-500' : 'bg-slate-600'}`}></span>
                  仿真: {simulationResult ? '已完成' : '未运行'}
                </div>
              </div>
            </div>

            {/* Simulation Progress */}
            {isSimulating && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-2xl p-8 w-96 border border-slate-700">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">正在仿真...</h3>
                  <p className="text-sm text-slate-400 text-center mb-6">计算磁场分布和角度误差</p>
                  <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${useToolStore.getState().simulationProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 text-center">{useToolStore.getState().simulationProgress.toFixed(0)}%</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Toaster position="top-right" />
    </div>
  )
}
