#!/usr/bin/env bun

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { contrastAnalysisTool, handleContrastAnalysis } from './tools/contrast';
import { accessibilityAnalysisTool, handleAccessibilityAnalysis } from './tools/accessibility';
import { wcagComplianceTool, handleWCAGCompliance } from './tools/compliance';
import { batchContrastTool, handleBatchContrast } from './tools/batch';

class WCAGServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'wcag-mcp-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // Register tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          contrastAnalysisTool,
          accessibilityAnalysisTool,
          wcagComplianceTool,
          batchContrastTool
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_contrast':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await handleContrastAnalysis(args), null, 2)
                }
              ]
            };

          case 'get_color_luminance':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await handleAccessibilityAnalysis(args), null, 2)
                }
              ]
            };

          case 'check_wcag_compliance':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await handleWCAGCompliance(args), null, 2)
                }
              ]
            };

          case 'batch_contrast':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await handleBatchContrast(args), null, 2)
                }
              ]
            };

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${errorMessage}`
        );
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Keep the server running
    console.error('WCAG MCP Server running on stdio');
  }
}

// Start the server
async function main() {
  const server = new WCAGServer();
  await server.run();
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
