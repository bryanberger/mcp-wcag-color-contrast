import { z } from 'zod';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ColorInput } from '../types/index';
import { analyzeContrast } from '../utils/color';

// Color pair for batch analysis
const ColorPair = z.object({
  foreground: ColorInput,
  background: ColorInput,
  label: z.string().optional()
});

// Input schema for batch contrast analysis
const BatchContrastSchema = z.object({
  colorPairs: z.array(ColorPair).min(1).max(50)
});

export const batchContrastTool: Tool = {
  name: 'batch_contrast_analysis',
  description: 'Analyze WCAG contrast ratios for multiple color pairs at once. Useful for checking entire color palettes or design systems.',
  inputSchema: {
    type: 'object',
    properties: {
      colorPairs: {
        type: 'array',
        minItems: 1,
        maxItems: 50,
        items: {
          type: 'object',
          properties: {
            foreground: {
              type: 'string',
              description: 'Foreground color'
            },
            background: {
              type: 'string',
              description: 'Background color'
            },
            label: {
              type: 'string',
              description: 'Optional label to identify this color pair'
            }
          },
          required: ['foreground', 'background']
        }
      }
    },
    required: ['colorPairs']
  }
};

export async function handleBatchContrast(args: unknown) {
  const { colorPairs } = BatchContrastSchema.parse(args);
  
  const results = colorPairs.map((pair, index) => {
    try {
      const analysis = analyzeContrast(pair.foreground, pair.background);
      return {
        index,
        label: pair.label || `Pair ${index + 1}`,
        success: true,
        ...analysis
      };
    } catch (error) {
      return {
        index,
        label: pair.label || `Pair ${index + 1}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
  
  const summary = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    passingAA: results.filter(r => r.success && 'passes' in r && r.passes?.AA.normal).length,
    passingAAA: results.filter(r => r.success && 'passes' in r && r.passes?.AAA.normal).length
  };
  
  return {
    summary,
    results
  };
}
