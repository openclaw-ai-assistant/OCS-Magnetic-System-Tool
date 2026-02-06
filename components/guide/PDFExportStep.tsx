'use client'

import { useRef, useState } from 'react'
import { useToolStore } from '@/store/toolStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Download, FileText, CheckCircle, Calendar, User, Building } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PDFReportExport() {
  const { configuration, simulationResult } = useToolStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    company: '',
    engineer: '',
    description: ''
  })
  const reportRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!simulationResult) {
      toast.error('请先运行仿真')
      return
    }

    setIsGenerating(true)
    toast.loading('正在生成PDF报告...')

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // 封面
      pdf.setFillColor(15, 23, 42) // slate-950
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      // 标题
      pdf.setTextColor(59, 130, 246) // blue-500
      pdf.setFontSize(28)
      pdf.setFont('helvetica', 'bold')
      pdf.text('OCS Magnetic System Tool', pageWidth / 2, 60, { align: 'center' })
      
      pdf.setTextColor(147, 197, 253) // blue-300
      pdf.setFontSize(18)
      pdf.text('磁传感器仿真设计报告', pageWidth / 2, 80, { align: 'center' })
      
      // 项目信息
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      const infoY = 120
      const lineHeight = 10
      
      if (projectInfo.projectName) {
        pdf.text(`项目名称: ${projectInfo.projectName}`, 30, infoY)
      }
      if (projectInfo.company) {
        pdf.text(`公司: ${projectInfo.company}`, 30, infoY + lineHeight)
      }
      if (projectInfo.engineer) {
        pdf.text(`工程师: ${projectInfo.engineer}`, 30, infoY + lineHeight * 2)
      }
      
      pdf.text(`生成日期: ${new Date().toLocaleDateString()}`, 30, infoY + lineHeight * 4)
      pdf.text(`报告版本: v1.0`, 30, infoY + lineHeight * 5)
      
      // 添加新页面 - 配置摘要
      pdf.addPage()
      pdf.setFillColor(248, 250, 252) // slate-50
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      pdf.setTextColor(15, 23, 42)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('1. 配置摘要', 20, 30)
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      
      let y = 50
      const col1 = 30
      const col2 = 80
      
      // 传感器信息
      pdf.setFont('helvetica', 'bold')
      pdf.text('传感器配置', 20, y)
      y += 10
      pdf.setFont('helvetica', 'normal')
      
      if (configuration.sensor) {
        pdf.text('型号:', col1, y)
        pdf.text(configuration.sensor.name, col2, y)
        y += 7
        
        pdf.text('分辨率:', col1, y)
        pdf.text(`${configuration.sensor.resolution}-bit`, col2, y)
        y += 7
        
        pdf.text('安装方式:', col1, y)
        pdf.text(configuration.sensor.mountType, col2, y)
        y += 7
        
        pdf.text('最高转速:', col1, y)
        pdf.text(`${configuration.sensor.maxRpm} RPM`, col2, y)
        y += 15
      }
      
      // 磁铁信息
      pdf.setFont('helvetica', 'bold')
      pdf.text('磁铁配置', 20, y)
      y += 10
      pdf.setFont('helvetica', 'normal')
      
      if (configuration.magnet) {
        pdf.text('型号:', col1, y)
        pdf.text(configuration.magnet.name, col2, y)
        y += 7
        
        pdf.text('材质:', col1, y)
        pdf.text(configuration.magnet.material.toUpperCase(), col2, y)
        y += 7
        
        pdf.text('剩磁:', col1, y)
        pdf.text(`${configuration.magnet.remanence} T`, col2, y)
        y += 7
        
        pdf.text('形状:', col1, y)
        pdf.text(configuration.magnet.shape, col2, y)
        y += 15
      }
      
      // 位置参数
      pdf.setFont('helvetica', 'bold')
      pdf.text('位置参数', 20, y)
      y += 10
      pdf.setFont('helvetica', 'normal')
      
      pdf.text('气隙:', col1, y)
      pdf.text(`${configuration.params.airGap} mm`, col2, y)
      y += 7
      
      pdf.text('传感器位置:', col1, y)
      pdf.text(`(${configuration.sensorPosition.position.x.toFixed(1)}, ${configuration.sensorPosition.position.y.toFixed(1)}, ${configuration.sensorPosition.position.z.toFixed(1)}) mm`, col2, y)
      y += 7
      
      pdf.text('工作温度:', col1, y)
      pdf.text(`${configuration.params.temperature}°C`, col2, y)
      y += 7
      
      pdf.text('转速:', col1, y)
      pdf.text(`${configuration.params.rpm} RPM`, col2, y)
      
      // 添加新页面 - 仿真结果
      if (simulationResult) {
        pdf.addPage()
        pdf.setFillColor(248, 250, 252)
        pdf.rect(0, 0, pageWidth, pageHeight, 'F')
        
        pdf.setTextColor(15, 23, 42)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('2. 仿真结果', 20, 30)
        
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        
        y = 50
        
        // 关键指标
        pdf.setFont('helvetica', 'bold')
        pdf.text('关键性能指标', 20, y)
        y += 10
        pdf.setFont('helvetica', 'normal')
        
        pdf.text('最大角度误差:', col1, y)
        pdf.text(`${simulationResult.maxError.toFixed(3)}°`, col2, y)
        y += 7
        
        pdf.text('平均角度误差:', col1, y)
        pdf.text(`${simulationResult.avgError.toFixed(3)}°`, col2, y)
        y += 7
        
        pdf.text('RMS误差:', col1, y)
        pdf.text(`${simulationResult.rmsError.toFixed(3)}°`, col2, y)
        y += 7
        
        pdf.text('信噪比:', col1, y)
        pdf.text(`${simulationResult.snr.toFixed(1)} dB`, col2, y)
        y += 7
        
        pdf.text('线性度:', col1, y)
        pdf.text(`${simulationResult.linearity.toFixed(3)}°`, col2, y)
        y += 20
        
        // 评估结论
        pdf.setFont('helvetica', 'bold')
        pdf.text('设计评估', 20, y)
        y += 10
        pdf.setFont('helvetica', 'normal')
        
        let evaluation = '配置合理，满足一般应用需求。'
        if (simulationResult.maxError < 0.1) {
          evaluation = '精度优秀，适合高精度测量应用。'
        } else if (simulationResult.maxError > 0.5) {
          evaluation = '误差偏大，建议优化配置或选择更高精度传感器。'
        }
        
        const splitText = pdf.splitTextToSize(evaluation, pageWidth - 40)
        pdf.text(splitText, 20, y)
      }
      
      // 添加新页面 - 推荐语
      pdf.addPage()
      pdf.setFillColor(248, 250, 252)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      pdf.setTextColor(15, 23, 42)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('3. 推荐与建议', 20, 30)
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      
      const recommendations = [
        '1. 建议在实际应用前进行原型测试验证。',
        '2. 请参考MPS官方数据手册获取详细电气参数。',
        '3. 注意PCB布局和传感器安装方向。',
        '4. 建议在最终产品中进行温度校准。',
        '5. 如需技术支持，请联系MPS FAE团队。'
      ]
      
      y = 50
      recommendations.forEach(rec => {
        const splitText = pdf.splitTextToSize(rec, pageWidth - 40)
        pdf.text(splitText, 20, y)
        y += splitText.length * 7 + 5
      })
      
      // 页脚
      const totalPages = (pdf as any).internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(148, 163, 184)
        pdf.text(`OCS Magnetic System Tool - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      }
      
      // 下载PDF
      pdf.save(`OCS-Report-${projectInfo.projectName || 'Untitled'}-${Date.now()}.pdf`)
      
      toast.dismiss()
      toast.success('PDF报告已生成！')
    } catch (error) {
      toast.dismiss()
      toast.error('生成PDF失败')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FileText className="text-green-400" />
          PDF报告导出
        </h2>
        <p className="text-slate-400">生成专业的设计报告文档</p>
      </div>

      {/* 项目信息表单 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Building size={18} className="text-blue-400" />
          项目信息
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">项目名称</label>
            <input
              type="text"
              value={projectInfo.projectName}
              onChange={(e) => setProjectInfo({...projectInfo, projectName: e.target.value})}
              placeholder="例如：伺服电机角度检测"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">公司</label>
              <input
                type="text"
                value={projectInfo.company}
                onChange={(e) => setProjectInfo({...projectInfo, company: e.target.value})}
                placeholder="公司名称"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">工程师</label>
              <input
                type="text"
                value={projectInfo.engineer}
                onChange={(e) => setProjectInfo({...projectInfo, engineer: e.target.value})}
                placeholder="工程师姓名"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">项目描述</label>
            <textarea
              value={projectInfo.description}
              onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
              placeholder="简要描述项目需求..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* 报告预览 */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold mb-4">报告内容预览</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm">封面 - 项目信息和日期</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm">配置摘要 - 传感器和磁铁详细参数</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm">仿真结果 - 关键性能指标</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm">推荐与建议 - 工程实施指导</span>
          </div>
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={generatePDF}
        disabled={isGenerating || !simulationResult}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-semibold text-lg"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            生成中...
          </>
        ) : (
          <>
            <Download size={24} />
            生成PDF报告
          </>
        )}
      </button>

      {!simulationResult && (
        <p className="text-center text-sm text-amber-400">
          ⚠️ 请先完成仿真才能生成报告
        </p>
      )}
    </div>
  )
}
