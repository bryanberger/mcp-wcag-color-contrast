import { z } from 'zod';

// WCAG compliance levels
export const WCAGLevel = z.enum(['AA', 'AAA']);
export type WCAGLevel = z.infer<typeof WCAGLevel>;

// Text size categories for WCAG
export const TextSize = z.enum(['normal', 'large']);
export type TextSize = z.infer<typeof TextSize>;

// Color input schema - Culori can parse any valid color string
export const ColorInput = z.string();
export type ColorInput = z.infer<typeof ColorInput>;

// Contrast analysis result
export const ContrastResult = z.object({
  ratio: z.number(),
  level: WCAGLevel.nullable(),
  passes: z.object({
    AA: z.object({
      normal: z.boolean(),
      large: z.boolean()
    }),
    AAA: z.object({
      normal: z.boolean(),
      large: z.boolean()
    })
  }),
  foreground: z.object({
    hex: z.string(),
    rgb: z.string(),
    hsl: z.string(),
    oklch: z.string()
  }),
  background: z.object({
    hex: z.string(),
    rgb: z.string(),
    hsl: z.string(),
    oklch: z.string()
  })
});
export type ContrastResult = z.infer<typeof ContrastResult>;

// Color accessibility analysis
export const AccessibilityAnalysis = z.object({
  color: z.object({
    hex: z.string(),
    rgb: z.string(),
    hsl: z.string(),
    oklch: z.string()
  }),
  luminance: z.number()
});
export type AccessibilityAnalysis = z.infer<typeof AccessibilityAnalysis>;
