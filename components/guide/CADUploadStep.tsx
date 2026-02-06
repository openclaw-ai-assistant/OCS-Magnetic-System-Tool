'use client'

import { useState, useRef } from 'react'
import { useToolStore } from '@/store/toolStore'
import { Upload, FileBox, CheckCircle, AlertTriangle, RotateCcw, Play, Download, Settings } from 'lucide-react'
import { runSimulation } from '@/lib/simulation/magnetic-field'
import toast from 'react-hot-toast'

interface CADUploadStepProps {
  onComplete: () => void
}

// 支持的CAD格式
const SUPPORTED_FORMATS = ['.step', '.stp', '.stl', '.obj', '.ply']

export default function CADUploadStep({ onComplete }: CADUploadStepProps) {
  const { configuration, setConfiguration, updateSensorPosition, updateMagnetPosition } = useToolStore()
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: number }[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() || '',
      size: file.size
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    toast.success(`已上传 ${newFiles.length} 个文件`)
  }

  // 模拟CAD解析和最佳位置计算
  const analyzeCAD = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('请先上传CAD文件')
      return
    }

    if (!configuration.sensor || !configuration.magnet) {
      toast.error('请先选择传感器和磁铁')
      return
    }

    setIsAnalyzing(true)
    toast.loading('正在解析CAD文件并计算最佳位置...')

    try {
      // 模拟CAD解析延迟
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 模拟几何分析结果
      const mockAnalysis = {
        // 检测到的安装空间
        availableSpace: {
          width: 25,
          height: 15,
          depth: 20
        },
        // 检测到的轴位置
        shaftPosition: { x: 0, y: 0, z: 0 },
        // 推荐的传感器位置
        recommendedSensorPos: { x: 0, y: 0, z: 2.5 },
        // 推荐的磁铁位置
        recommendedMagnetPos: { x: 0, y: 0, z: 0 },
        // 约束条件
        constraints: [
          '检测到轴端安装空间',
          '周围有10mm clearance',
          '建议气隙: 2.0-3.0mm'
        ],
        // 评估的多个位置
        evaluatedPositions: [
          { pos: { x: 0, y: 0, z: 2.0 }, score: 95, reason: '理想位置，气隙合适' },
          { pos: { x: 0, y: 0, z: 2.5 }, score: 92, reason: '标准气隙，性能良好' },
          { pos: { x: 0, y: 0, z: 3.0 }, score: 85, reason: '气隙稍大，仍可接受' },
          { pos: { x: 1, y: 0, z: 2.5 }, score: 78, reason: '有轻微偏心，建议调整' }
        ]
      }

      // 运行仿真验证最佳位置
      const bestPosition = mockAnalysis.evaluatedPositions[0]
      const testConfig = {
        ...configuration,
        sensorPosition: {
          ...configuration.sensorPosition,
          position: bestPosition.pos
        }
      }

      const simResult = await runSimulation(testConfig)

      setAnalysisResult({
        ...mockAnalysis,
        simulationResult: simResult,
        bestPosition: bestPosition
      })

      toast.dismiss()
      toast.success('CAD分析完成！')
    } catch (error) {
      toast.dismiss()
      toast.error('分析失败')
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 应用推荐位置
  const applyRecommendedPosition = () => {
    if (!analysisResult) return

    const bestPos = analysisResult.bestPosition.pos
    updateSensorPosition({ position: bestPos })
    updateMagnetPosition({ position: { x: 0, y: 0, z: 0 } })

    toast.success('已应用最佳位置')
    onComplete()
  }

  // 移除文件
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FileBox className="text-cyan-400" />
          CAD自动评估
        </h2>
        <p className="text-slate-400">上传结构CAD文件，自动分析并推荐最佳传感器位置</p>
      </div>

      {/* 文件上传区域 */}
      <div 
        className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-slate-800/30 transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} className="mx-auto mb-4 text-slate-500" />
        <p className="text-slate-400 mb-2">点击或拖拽上传CAD文件</p>
        <p className="text-xs text-slate-500">
          支持格式: {SUPPORTED_FORMATS.join(', ')}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h3 className="font-semibold mb-3">已上传文件</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileBox size={20} className="text-blue-400" />
                  <div>
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 开始分析按钮 */}
      {uploadedFiles.length > 0 && !analysisResult && (
        <button
          onClick={analyzeCAD}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 rounded-xl transition-all font-semibold text-lg"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              分析中...
            </>
          ) : (
            <>
              <Settings size={24} />
              开始CAD分析
            </>
          )}
        </button>
      )}

      {/* 分析结果 */}
      {analysisResult && (
        <div className="space-y-4">
          {/* 总体评估 */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-green-400">分析完成</h3>
                <p className="text-sm text-slate-400">
                  最佳位置评分: {analysisResult.bestPosition.score}/100
                </p>
              </div>
            </div>

            {/* 推荐位置 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">推荐传感器位置</div>
                <div className="font-mono text-lg">
                  ({analysisResult.bestPosition.pos.x.toFixed(1)}, 
                   {analysisResult.bestPosition.pos.y.toFixed(1)}, 
                   {analysisResult.bestPosition.pos.z.toFixed(1)}) mm
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">预期气隙</div>
                <div className="font-mono text-lg text-blue-400">
                  {analysisResult.bestPosition.pos.z.toFixed(1)} mm
                </div>
              </div>
            </div>

            {/* 评估详情 */}
            <div className="bg-slate-900/30 rounded-lg p-3 mb-4">
              <div className="text-sm text-slate-300">
                {analysisResult.bestPosition.reason}
              </div>
            </div>

            <button
              onClick={applyRecommendedPosition}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors font-medium"
            >
              <CheckCircle size={20} />
              应用推荐位置
            </button>
          </div>

          {/* 备选位置 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold mb-3">备选位置评估</h3>
            <div className="space-y-2">
              {analysisResult.evaluatedPositions.slice(1).map((pos: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div>
                    <div className="font-mono text-sm">
                      ({pos.pos.x.toFixed(1)}, {pos.pos.y.toFixed(1)}, {pos.pos.z.toFixed(1)}) mm
                    </div>
                    <div className="text-xs text-slate-500">{pos.reason}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pos.score >= 90 ? 'bg-green-500/20 text-green-400' :
                    pos.score >= 80 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {pos.score}分
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 约束条件 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              检测到的约束
            </h3>
            <ul className="space-y-2">
              {analysisResult.constraints.map((constraint: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-blue-400">•</span>
                  {constraint}
                </li>
              ))}
            </ul>
          </div>

          {/* 重新分析 */}
          <button
            onClick={() => {
              setAnalysisResult(null)
              setUploadedFiles([])
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <RotateCcw size={18} />
            重新上传分析
          </button>
        </div>
      )}

      {/* 说明 */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Settings size={18} className="text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-400">
            <p className="font-medium mb-1">CAD自动评估说明</p>
            <p>上传STEP、STL等格式的CAD文件后，系统会自动：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>解析几何结构和安装空间</li>
              <li>检测轴/孔等关键特征</li>
              <li>评估多个候选位置</li>
              <li>仿真验证并给出评分</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
