import { z } from 'zod';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ColorInput, ContrastResult } from '../types/index';
import { analyzeContrast } from '../utils/color';

// Input schema for contrast analysis
const ContrastAnalysisSchema = z.object({
  foreground: ColorInput,
  background: ColorInput
});

export const contrastAnalysisTool: Tool = {
  name: 'analyze_contrast',
  description: 'Analyze WCAG color contrast ratio between foreground and background colors. Supports multiple color formats (hex, rgb, hsl, named colors).',
  inputSchema: {
    type: 'object',
    properties: {
      foreground: {
        type: 'string',
        description: 'Foreground color as hex (#ff0000), rgb(255,0,0), hsl(0,100%,50%), or named color (red)'
      },
      background: {
        type: 'string', 
        description: 'Background color as hex (#ffffff), rgb(255,255,255), hsl(0,0%,100%), or named color (white)'
      }
    },
    required: ['foreground', 'background']
  }
};

export async function handleContrastAnalysis(args: unknown): Promise<ContrastResult> {
  const { foreground, background } = ContrastAnalysisSchema.parse(args);
  return analyzeContrast(foreground, background);
}
