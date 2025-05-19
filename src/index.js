/**
 * Robot Framework MCP Server
 * 
 * This is the main entry point for the Robot Framework MCP server.
 * It exports the core functionality for programmatic usage and
 * can also be run directly to start the server.
 */

const { startServer } = require('./lib/server');
const { executeToolRequest } = require('./lib/tools');
const { executeRobotCommand, generateTempRobotScript } = require('./lib/robot-runner');
const browserTools = require('./lib/tools/browser');
const elementTools = require('./lib/tools/element');
const keyboardTools = require('./lib/tools/keyboard');

// Export core functionality for programmatic usage
module.exports = {
  // Server
  startServer,
  
  // Tool execution
  executeToolRequest,
  
  // Robot Framework integration
  executeRobotCommand,
  generateTempRobotScript,
  
  // Tools
  browserTools,
  elementTools,
  keyboardTools
};

// When run directly, start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  startServer(PORT);
  console.log(`Robot Framework MCP server starting on port ${PORT}...`);
} 