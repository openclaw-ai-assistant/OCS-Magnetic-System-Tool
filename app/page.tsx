/**
 * OCS Magnetic System Tool
 * 
 * A comprehensive magnetic sensor simulation platform inspired by MPS Magnetic Design Tool.
 * 
 * Features:
 * - Sensor Family Selection (MagAlpha, MagVector)
 * - 3D Position Configuration with real-time visualization
 * - Magnet Library & Custom Magnet Configuration
 * - Real-time Magnetic Field Simulation
 * - Results Visualization & Analysis
 * - PDF Report Generation
 * - Advanced Features:
 *   - Batch Simulation
 *   - Comparison Mode
 *   - Preset Templates
 *   - Export/Import Configurations
 * 
 * @version 1.0.0
 * @author OCS Team
 */

import MagneticTool from '@/components/MagneticTool'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <MagneticTool />
    </main>
  )
}
