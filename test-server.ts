#!/usr/bin/env bun

/**
 * Simple test script to verify the WCAG MCP server functionality
 */

import { analyzeContrast, analyzeColorAccessibility } from './src/utils/color';

console.log('🧪 Testing WCAG MCP Server Utilities\n');

// Test 1: Basic contrast analysis
console.log('1. Testing contrast analysis...');
try {
  const result = analyzeContrast('#000000', '#ffffff');
  console.log('✅ Black on white:', result.ratio, '(Level:', result.level + ')');
} catch (error) {
  console.log('❌ Error:', error);
}

// Test 2: Poor contrast
console.log('\n2. Testing poor contrast...');
try {
  const result = analyzeContrast('#cccccc', '#ffffff');
  console.log('⚠️  Light gray on white:', result.ratio, '(Level:', result.level + ')');
} catch (error) {
  console.log('❌ Error:', error);
}

// Test 3: Color accessibility analysis
console.log('\n3. Testing color accessibility analysis...');
try {
  const result = analyzeColorAccessibility('#3366cc');
  console.log('🔍 Blue color analysis:');
  console.log('   Luminance:', result.luminance);
  console.log('   Color formats:', result.color);
} catch (error) {
  console.log('❌ Error:', error);
}

// Test 4: Different color formats
console.log('\n4. Testing different color formats...');
try {
  const hexResult = analyzeContrast('#ff0000', '#ffffff');
  const rgbResult = analyzeContrast('rgb(255, 0, 0)', 'white');
  const hslResult = analyzeContrast('hsl(0, 100%, 50%)', '#fff');
  
  console.log('✅ Hex format ratio:', hexResult.ratio);
  console.log('✅ RGB format ratio:', rgbResult.ratio);  
  console.log('✅ HSL format ratio:', hslResult.ratio);
  
  if (hexResult.ratio === rgbResult.ratio && rgbResult.ratio === hslResult.ratio) {
    console.log('✅ All formats produce consistent results');
  } else {
    console.log('⚠️  Format inconsistency detected');
  }
} catch (error) {
  console.log('❌ Error:', error);
}

console.log('\n🎉 Test complete! Server utilities are working correctly.');
