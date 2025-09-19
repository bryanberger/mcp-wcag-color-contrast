# WCAG MCP Server

A Model Context Protocol (MCP) server for WCAG color contrast checking and accessibility analysis. Built with Bun, TypeScript, and Culori.

## Quick Start

```bash
# Install
bun install

# Build and run
bun run build
bun run start
```

## MCP Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "wcag": {
      "command": "bun",
      "args": ["run", "start"],
      "cwd": "/path/to/wcag"
    }
  }
}
```

## Tools

### `analyze_contrast`
Calculate WCAG contrast ratio between two colors.

```json
{
  "foreground": "red", 
  "background": "white"
}
```

Returns ratio, compliance levels, and color details.

### `analyze_color_accessibility`
Analyze single color properties.

```json
{
  "color": "#3366cc"
}
```

Returns luminance and formatted color values.

### `check_wcag_compliance`
Check specific WCAG compliance.

```json
{
  "foreground": "#666666",
  "background": "#ffffff", 
  "level": "AA",
  "textSize": "normal"
}
```

### `batch_contrast_analysis`
Analyze multiple color pairs.

```json
{
  "colorPairs": [
    {"foreground": "red", "background": "white", "label": "Error text"},
    {"foreground": "blue", "background": "gray", "label": "Link"}
  ]
}
```

## Color Formats

Supports any format Culori can parse:
- Hex: `#ff0000`, `#f00`
- CSS: `rgb(255,0,0)`, `hsl(0,100%,50%)`
- Named: `red`, `blue`, `white`
- Modern: `oklch(0.7 0.15 180)`

## WCAG Standards

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA    | 4.5:1       | 3:1        |
| AAA   | 7:1         | 4.5:1      |

## Development

```bash
bun run dev        # Development with hot reload
bun run build      # Build for production  
bun run type-check # TypeScript validation
```

## License

MIT