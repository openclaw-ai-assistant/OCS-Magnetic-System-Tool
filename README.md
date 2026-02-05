# OCS Magnetic System Tool 🧲

A comprehensive magnetic sensor simulation and design platform inspired by MPS Magnetic Design Tool.

![OCS Magnetic System Tool](https://img.shields.io/badge/OCS-Magnetic%20System%20Tool-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black)

## ✨ Features

### Core Functionality
- 🔧 **Sensor Family Selection**
  - MagAlpha Sensors (End-of-Shaft, Side-Shaft, Side-Shaft-Orthogonal)
  - MagVector Sensors (Circular, Linear motion)
  
- 🎯 **3D Position Configuration**
  - Real-time 3D visualization
  - Precise position and rotation control
  - Interactive 3D canvas with orbit controls

- 🧲 **Magnet Library**
  - Pre-configured magnet library (Cylinder, Ring, Rectangle, Arc)
  - Multiple materials (NdFeB, SmCo, Alnico, Ferrite)
  - Custom magnet configuration

- ⚡ **Real-time Simulation**
  - Magnetic field calculation
  - Angle error analysis
  - Output signal generation (Sin/Cos)
  - SNR and linearity calculation

- 📊 **Results Visualization**
  - Interactive charts (Recharts)
  - Angle error plots
  - Signal waveform display
  - Performance metrics

- 📄 **Report Generation**
  - PDF export capability
  - Configuration summary
  - Simulation results

### Advanced Features
- 🔄 **Comparison Mode** - Compare multiple configurations
- 📦 **Batch Simulation** - Run simulations on multiple setups
- 💾 **Preset Templates** - Save and load configurations
- 🌐 **Export/Import** - Share configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/OCS-Magnetic-System-Tool.git
cd OCS-Magnetic-System-Tool

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js + React Three Fiber
- **Charts:** Recharts
- **State Management:** Zustand
- **UI Components:** Radix UI
- **Icons:** Lucide React

## 📁 Project Structure

```
ocs-magnetic-system-tool/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MagneticTool.tsx   # Main tool component
│   ├── layout/           # Layout components
│   │   ├── Sidebar.tsx   # Left navigation
│   │   ├── Canvas3D.tsx  # 3D visualization
│   │   └── ResultsPanel.tsx
│   ├── sensor/           # Sensor components
│   ├── magnet/           # Magnet components
│   └── simulation/       # Simulation components
├── lib/                  # Utility libraries
│   ├── simulation/       # Magnetic field simulation
│   ├── database/         # Sensor/magnet data
│   └── utils/           # Helper functions
├── store/               # Zustand store
├── types/              # TypeScript types
└── public/             # Static assets
```

## 🎮 Usage Guide

### 1. Select Sensor
- Choose from MagAlpha or MagVector sensor families
- View sensor specifications (resolution, max RPM, package)

### 2. Configure Position
- Adjust sensor position in 3D space (X, Y, Z coordinates)
- Set rotation angles
- View real-time 3D preview

### 3. Select Magnet
- Choose from magnet library
- Or create custom magnet configuration
- Set magnet position and rotation

### 4. Set Parameters
- Air gap distance
- Rotation speed (RPM)
- Temperature
- Samples per revolution
- Noise level

### 5. Run Simulation
- Click "QuickSim" button
- View real-time progress
- Analyze results in charts

### 6. Generate Report
- Switch to Report tab
- Generate PDF report
- Save or share configuration

## 🔬 Simulation Algorithm

The tool uses a simplified magnetic dipole model for field calculations:

```
B = (μ₀/4π) * (3(m·r)r/r⁵ - m/r³)
```

Where:
- B = Magnetic field vector
- μ₀ = Magnetic constant
- m = Magnetic moment
- r = Distance vector from magnet

## 🎯 Performance Metrics

The tool calculates:
- **Max Error:** Maximum angle measurement error
- **RMS Error:** Root mean square error
- **SNR:** Signal-to-noise ratio
- **Linearity:** Maximum deviation from linear response

## 🔧 Configuration

### Environment Variables
```env
# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [MPS Magnetic Design Tool](https://sensors.monolithicpower.com/)
- Built with [Next.js](https://nextjs.org/)
- 3D visualization powered by [Three.js](https://threejs.org/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ by OCS Team**
