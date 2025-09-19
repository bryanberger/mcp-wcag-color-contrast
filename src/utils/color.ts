import { 
  formatHex, 
  formatRgb,
  formatHsl,
  formatCss,
  wcagContrast,
  wcagLuminance
} from 'culori';
import type { ColorInput, ContrastResult, AccessibilityAnalysis, WCAGLevel, TextSize } from '../types/index';

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function calculateContrastRatio(foreground: ColorInput, background: ColorInput): number {
  return wcagContrast(foreground, background);
}

/**
 * Get WCAG compliance level for a contrast ratio
 */
export function getWCAGLevel(ratio: number, textSize: TextSize = 'normal'): WCAGLevel | null {
  if (textSize === 'large') {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA';
  } else {
    if (ratio >= 7.0) return 'AAA';
    if (ratio >= 4.5) return 'AA';
  }
  return null;
}

/**
 * Check if contrast ratio passes WCAG requirements
 */
export function checkWCAGCompliance(ratio: number) {
  return {
    AA: {
      normal: ratio >= 4.5,
      large: ratio >= 3.0
    },
    AAA: {
      normal: ratio >= 7.0,
      large: ratio >= 4.5
    }
  };
}

/**
 * Normalize color to consistent format for output
 */
export function normalizeColorOutput(color: ColorInput) {
  const hex = formatHex(color);
  const rgb = formatRgb(color);
  const hsl = formatHsl(color);
  const oklch = formatCss(color);
  
  if (!hex || !rgb || !hsl || !oklch) {
    throw new Error(`Invalid color: ${color}`);
  }
  
  return { hex, rgb, hsl, oklch };
}

/**
 * Perform comprehensive contrast analysis
 */
export function analyzeContrast(foreground: ColorInput, background: ColorInput): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);
  const passes = checkWCAGCompliance(ratio);
  
  // Determine highest level that passes for normal text
  let level: WCAGLevel | null = null;
  if (passes.AAA.normal) level = 'AAA';
  else if (passes.AA.normal) level = 'AA';
  
  return {
    ratio: Number(ratio.toFixed(2)),
    level,
    passes,
    foreground: normalizeColorOutput(foreground),
    background: normalizeColorOutput(background)
  };
}

/**
 * Analyze color accessibility properties
 */
export function analyzeColorAccessibility(color: ColorInput): AccessibilityAnalysis {
  return {
    color: normalizeColorOutput(color),
    luminance: Number(wcagLuminance(color).toFixed(4))
  };
}
