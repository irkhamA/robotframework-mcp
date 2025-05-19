/**
 * Robot Framework MCP - Programmatic Usage Example
 * 
 * This example demonstrates how to use the robotframework-mcp package programmatically
 * to interact with a web page using Robot Framework's SeleniumLibrary.
 */

// Import the robotframework-mcp package
// In a real project, you would use: const rfMcp = require('robotframework-mcp');
const rfMcp = require('../src/index');
const net = require('net');

/**
 * Check if a port is available
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if the port is available
 */
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => {
        // Port is not available
        resolve(false);
      })
      .once('listening', () => {
        // Port is available, close the server
        server.close(() => resolve(true));
      })
      .listen(port);
  });
}

/**
 * Start the MCP server with port conflict handling
 * @param {number} preferredPort - The preferred port to use
 * @returns {Promise<number>} - The port that was actually used
 */
async function startMCPServer(preferredPort = 3001) {
  // Check if the preferred port is available
  if (await isPortAvailable(preferredPort)) {
    rfMcp.startServer(preferredPort);
    console.log(`Robot Framework MCP server started on port ${preferredPort}`);
    return preferredPort;
  } else {
    // Find the next available port
    for (let port = preferredPort + 1; port < preferredPort + 10; port++) {
      if (await isPortAvailable(port)) {
        rfMcp.startServer(port);
        console.log(`Preferred port ${preferredPort} was in use.`);
        console.log(`Robot Framework MCP server started on port ${port}`);
        return port;
      }
    }
    throw new Error(`Could not find an available port after trying 10 ports starting from ${preferredPort}`);
  }
}

// Create a map to store sessions (simulate the server's session storage)
const sessions = new Map();

// Example of programmatic usage
async function runDemo() {
  try {
    // Start the MCP server with port conflict handling
    await startMCPServer(3001);
    
    // Start a browser session
    console.log('Starting browser...');
    const browserResult = await rfMcp.browserTools.startBrowser({
      browser: 'chrome',
      options: { headless: true }
    }, sessions);
    
    if (browserResult.status !== 'success') {
      throw new Error(`Failed to start browser: ${browserResult.error}`);
    }
    
    const sessionId = browserResult.result.sessionId;
    console.log(`Browser started with session ID: ${sessionId}`);
    
    // Navigate to a URL
    console.log('Navigating to example.com...');
    const navResult = await rfMcp.browserTools.navigate({
      url: 'https://www.example.com'
    }, sessions);
    
    if (navResult.status !== 'success') {
      throw new Error(`Failed to navigate: ${navResult.error}`);
    }
    
    // Find and get text from an element
    console.log('Getting page heading...');
    const textResult = await rfMcp.elementTools.getElementText({
      by: 'tag',
      value: 'h1',
      timeout: 5000
    }, sessions);
    
    if (textResult.status === 'success') {
      console.log(`Page heading: ${textResult.result.text}`);
    } else {
      console.error(`Failed to get text: ${textResult.error}`);
    }
    
    // Take a screenshot
    console.log('Taking screenshot...');
    const screenshotResult = await rfMcp.browserTools.takeScreenshot({
      outputPath: 'example-screenshot.png'
    }, sessions);
    
    if (screenshotResult.status === 'success') {
      console.log(`Screenshot saved: ${screenshotResult.result.message}`);
    } else {
      console.error(`Failed to take screenshot: ${screenshotResult.error}`);
    }
    
    // Close the browser
    console.log('Closing browser...');
    const closeResult = await rfMcp.browserTools.closeSession({}, sessions, sessionId);
    
    if (closeResult.status === 'success') {
      console.log('Browser closed successfully');
    } else {
      console.error(`Failed to close browser: ${closeResult.error}`);
    }
    
  } catch (error) {
    console.error('Error in demo:', error);
  }
  
  // Exit the process after completion
  console.log('Demo completed');
  process.exit(0);
}

// Run the demo
runDemo(); 