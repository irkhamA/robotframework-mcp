#!/usr/bin/env node

/**
 * Robot Framework MCP CLI
 * 
 * Command line interface for the Robot Framework MCP server.
 */

const { startServer } = require('../src/lib/server');

// Parse command line arguments
const args = process.argv.slice(2);
let port = 3000;
let helpRequested = false;
let versionRequested = false;

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--port' || arg === '-p') {
    port = parseInt(args[++i], 10);
    if (isNaN(port)) {
      console.error('Error: Invalid port number');
      process.exit(1);
    }
  } else if (arg === '--help' || arg === '-h') {
    helpRequested = true;
  } else if (arg === '--version' || arg === '-v') {
    versionRequested = true;
  }
}

// Display help
if (helpRequested) {
  console.log(`
Robot Framework MCP Server

Usage: robotframework-mcp [options]

Options:
  --port, -p <number>   Port to listen on (default: 3000)
  --help, -h            Display this help message
  --version, -v         Display version information
  `);
  process.exit(0);
}

// Display version
if (versionRequested) {
  const packageJson = require('../package.json');
  console.log(`Robot Framework MCP Server v${packageJson.version}`);
  process.exit(0);
}

// Start the server
console.log(`Starting Robot Framework MCP server on port ${port}...`);
startServer(port);

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...');
  process.exit(0);
});