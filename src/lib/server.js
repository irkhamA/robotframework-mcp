/**
 * MCP Server Implementation
 * 
 * Handles incoming MCP requests and routes them to the appropriate tool handlers.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { executeToolRequest } = require('./tools');

// Map to store active sessions
const sessions = new Map();

/**
 * Start the MCP server
 * @param {number} port - The port to listen on
 * @returns {object} - The server instance
 */
function startServer(port) {
  const app = express();
  
  // Parse JSON bodies
  app.use(bodyParser.json());
  
  // MCP endpoint
  app.post('/mcp', async (req, res) => {
    try {
      const { tool, parameters } = req.body;
      console.log(`Received tool request: ${tool}`, parameters);
      
      // Execute the tool request
      const result = await executeToolRequest(tool, parameters, sessions);
      
      console.log(`Tool execution result: ${result.status}`);
      res.json(result);
    } catch (error) {
      console.error(`Error executing tool: ${error.message}`);
      res.status(400).json({
        status: 'error',
        error: error.message
      });
    }
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // Start server with error handling
  const server = app.listen(port);
  
  // Handle errors during startup
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Error: Port ${port} is already in use.`);
      console.error('Try using a different port or the --auto-port option.');
      throw error;
    } else {
      console.error(`Error starting server: ${error.message}`);
      throw error;
    }
  });
  
  server.on('listening', () => {
    console.log(`MCP Robot Framework server running on port ${port}`);
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down MCP server...');
    // Close any active sessions
    for (const [sessionId, session] of sessions.entries()) {
      if (session.cleanup && typeof session.cleanup === 'function') {
        try {
          session.cleanup();
        } catch (error) {
          console.error(`Error cleaning up session ${sessionId}:`, error);
        }
      }
    }
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  });
  
  return server;
}

module.exports = { startServer }; 