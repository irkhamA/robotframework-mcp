/**
 * Robot Framework MCP - Programmatic Usage Example
 * 
 * This example demonstrates how to use the robotframework-mcp package programmatically
 * to interact with a web page using Robot Framework's SeleniumLibrary.
 */

// Import the robotframework-mcp package
// In a real project, you would use: const rfMcp = require('robotframework-mcp');
const rfMcp = require('../src/index');

// Start the MCP server on port 3001
rfMcp.startServer(3001);
console.log('Robot Framework MCP server started on port 3001');

// Create a map to store sessions (simulate the server's session storage)
const sessions = new Map();

// Example of programmatic usage
async function runDemo() {
  try {
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

// Wait for server to be ready before running the demo
setTimeout(runDemo, 1000); 