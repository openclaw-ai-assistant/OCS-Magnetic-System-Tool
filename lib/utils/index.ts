import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number with fixed decimal places
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals)
}

// Format degrees
export function formatDegrees(degrees: number): string {
  return `${degrees.toFixed(2)}°`
}

// Format millimeters
export function formatMM(mm: number): string {
  return `${mm.toFixed(2)} mm`
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Convert degrees to radians
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Convert radians to degrees
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Round to nearest step
export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step
}

// Calculate distance between two 3D points
export function distance3D(
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2)
}

// Download file helper
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Parse CSV
export function parseCSV(csv: string): string[][] {
  return csv.split('\n').map(row => row.split(',').map(cell => cell.trim()))
}

// Export to CSV
export function exportToCSV(data: (string | number)[][]): string {
  return data.map(row => row.join(',')).join('\n')
}
