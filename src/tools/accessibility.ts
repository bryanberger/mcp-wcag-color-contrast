import { z } from 'zod';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ColorInput, AccessibilityAnalysis } from '../types/index';
import { analyzeColorAccessibility } from '../utils/color';

// Input schema for accessibility analysis
const AccessibilityAnalysisSchema = z.object({
  color: ColorInput
});

export const accessibilityAnalysisTool: Tool = {
  name: 'get_color_luminance',
  description: 'Get color luminance value and format conversions.',
  inputSchema: {
    type: 'object',
    properties: {
      color: {
        type: 'string',
        description: 'Color as hex (#ff0000), rgb(255,0,0), hsl(0,100%,50%), or named color (red)'
      }
    },
    required: ['color']
  }
};

export async function handleAccessibilityAnalysis(args: unknown): Promise<AccessibilityAnalysis> {
  const { color } = AccessibilityAnalysisSchema.parse(args);
  return analyzeColorAccessibility(color);
}
