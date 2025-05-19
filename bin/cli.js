#!/usr/bin/env node

/**
 * Robot Framework MCP CLI
 * 
 * Command line interface for the Robot Framework MCP server.
 */

const { startServer } = require('../src/lib/server');
const net = require('net');

// Parse command line arguments
const args = process.argv.slice(2);
let port = 3000;
let helpRequested = false;
let versionRequested = false;
let autoSelectPort = false;

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--port' || arg === '-p') {
    port = parseInt(args[++i], 10);
    if (isNaN(port)) {
      console.error('Error: Invalid port number');
      process.exit(1);
    }
  } else if (arg === '--auto-port' || arg === '-a') {
    autoSelectPort = true;
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
  --auto-port, -a       Automatically find an available port if the specified one is busy
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

/**
 * Check if a port is available
 * @param {number} portToCheck - The port to check
 * @returns {Promise<boolean>} - True if the port is available
 */
function isPortAvailable(portToCheck) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => {
        // Port is not available
        resolve(false);
      })
      .once('listening', () => {
        // Port is available, close the server
        tester.close(() => resolve(true));
      })
      .listen(portToCheck);
  });
}

/**
 * Find an available port starting from the specified one
 * @param {number} startPort - The port to start checking from
 * @returns {Promise<number>} - The first available port
 */
async function findAvailablePort(startPort) {
  let currentPort = startPort;
  // Try up to 100 ports
  for (let i = 0; i < 100; i++) {
    if (await isPortAvailable(currentPort)) {
      return currentPort;
    }
    currentPort++;
  }
  throw new Error('Could not find an available port');
}

// Start the server with port handling
async function startMCPServer() {
  try {
    if (autoSelectPort) {
      port = await findAvailablePort(port);
    } else {
      // Check if specified port is available
      const available = await isPortAvailable(port);
      if (!available) {
        console.error(`Error: Port ${port} is already in use.`);
        console.error('Try using --auto-port to automatically select an available port.');
        process.exit(1);
      }
    }
    
    console.log(`Starting Robot Framework MCP server on port ${port}...`);
    startServer(port);
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
}

startMCPServer();

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...');
  process.exit(0);
});