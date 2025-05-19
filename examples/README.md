# Robot Framework MCP Examples

This directory contains examples of how to use the Robot Framework MCP package.

## Programmatic Usage

The `programmatic-usage.js` file demonstrates how to use the package programmatically in a Node.js application.

To run the example:

```bash
node programmatic-usage.js
```

**Note:** This example requires Robot Framework and SeleniumLibrary to be installed on your system.

## MCP Client Configuration

The `mcp-config.json` file shows how to configure different MCP clients to use this package:

### Claude Desktop

For Claude Desktop, copy the contents of `mcp-config.json` into your Claude Desktop configuration file.

### Goose

For Goose, you can use:

```
goose://extension?cmd=npx&arg=-y&arg=robotframework-mcp&id=robotframework-mcp&name=Robot%20Framework%20MCP&description=automates%20browser%20interactions%20with%20Robot%20Framework
```

### Other MCP Clients

Consult your MCP client's documentation for specifics on how to add custom MCP servers. 