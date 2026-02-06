'use client'

import { WizardStep } from '@/components/MagneticTool'
import { Check, Circle, ChevronRight } from 'lucide-react'

interface Step {
  id: WizardStep
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: WizardStep
  onStepClick: (step: WizardStep) => void
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="bg-slate-900/80 border-b border-slate-700/50 py-4 px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = index < currentIndex
          const isClickable = index <= currentIndex + 1

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Button */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-3 transition-all ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30'
                      : isCompleted
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-slate-800 border-2 border-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step Text */}
                <div className="hidden sm:block text-left">
                  <div
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500">{step.description}</div>
                </div>
              </button>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="mx-4 sm:mx-8">
                  <ChevronRight
                    size={20}
                    className={`transition-colors ${
                      index < currentIndex ? 'text-green-500' : 'text-slate-600'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
