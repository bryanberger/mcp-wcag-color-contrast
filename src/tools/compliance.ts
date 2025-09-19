import { z } from 'zod';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ColorInput, WCAGLevel, TextSize } from '../types/index';
import { calculateContrastRatio, getWCAGLevel, checkWCAGCompliance } from '../utils/color';

// Input schema for WCAG compliance check
const WCAGComplianceSchema = z.object({
  foreground: ColorInput,
  background: ColorInput,
  level: WCAGLevel.optional(),
  textSize: TextSize.optional()
});

export const wcagComplianceTool: Tool = {
  name: 'check_wcag_compliance',
  description: 'Check if color combination meets WCAG compliance requirements for specified level (AA/AAA) and text size (normal/large).',
  inputSchema: {
    type: 'object',
    properties: {
      foreground: {
        type: 'string',
        description: 'Foreground color as hex, rgb, hsl, or named color'
      },
      background: {
        type: 'string',
        description: 'Background color as hex, rgb, hsl, or named color'
      },
      level: {
        type: 'string',
        enum: ['AA', 'AAA'],
        description: 'WCAG compliance level to check against',
        default: 'AA'
      },
      textSize: {
        type: 'string',
        enum: ['normal', 'large'],
        description: 'Text size category (normal: <18pt or <14pt bold, large: ≥18pt or ≥14pt bold)',
        default: 'normal'
      }
    },
    required: ['foreground', 'background']
  }
};

export async function handleWCAGCompliance(args: unknown) {
  const { foreground, background, level = 'AA', textSize = 'normal' } = WCAGComplianceSchema.parse(args);
  
  const ratio = calculateContrastRatio(foreground, background);
  const compliance = checkWCAGCompliance(ratio);
  const achievedLevel = getWCAGLevel(ratio, textSize);
  
  const passes = textSize === 'large' 
    ? compliance[level].large 
    : compliance[level].normal;
  
  return {
    passes,
    ratio: Number(ratio.toFixed(2)),
    requiredRatio: getRequiredRatio(level, textSize),
    achievedLevel,
    requestedLevel: level,
    textSize,
    recommendation: passes 
      ? `✓ Passes ${level} compliance for ${textSize} text`
      : `✗ Fails ${level} compliance for ${textSize} text. Minimum ratio: ${getRequiredRatio(level, textSize)}, actual: ${ratio.toFixed(2)}`
  };
}

function getRequiredRatio(level: WCAGLevel, textSize: TextSize): number {
  if (level === 'AAA') {
    return textSize === 'large' ? 4.5 : 7.0;
  }
  return textSize === 'large' ? 3.0 : 4.5;
}
