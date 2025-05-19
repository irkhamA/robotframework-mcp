/**
 * Browser Tools
 * 
 * MCP browser tools that map to Robot Framework SeleniumLibrary keywords.
 */

const { executeRobotCommand, generateTempRobotScript } = require('../robot-runner');
const fs = require('fs');
const path = require('path');

/**
 * Start a browser session
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function startBrowser(params, sessions) {
  const { browser, options = {} } = params;
  
  // Validate parameters
  if (!browser) {
    return {
      status: 'error',
      error: 'Browser parameter is required'
    };
  }
  
  // Generate a unique session ID
  const sessionId = Date.now().toString();
  
  // Map browser name to Robot Framework browser
  let browserName = browser.toLowerCase();
  if (browserName === 'chrome') {
    browserName = 'chrome';
  } else if (browserName === 'firefox') {
    browserName = 'firefox';
  } else {
    return {
      status: 'error',
      error: `Unsupported browser: ${browser}`
    };
  }
  
  // Handle headless mode
  const headless = options.headless || false;
  const browserOptions = [];
  
  if (headless) {
    if (browserName === 'chrome') {
      browserOptions.push('headless=True');
    } else if (browserName === 'firefox') {
      browserOptions.push('headless=True');
    }
  }
  
  // Add any additional arguments
  if (options.arguments && Array.isArray(options.arguments)) {
    options.arguments.forEach(arg => {
      browserOptions.push(arg);
    });
  }
  
  // Generate Robot Framework script
  const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Start Browser Session
    ${headless ? '# Headless Mode Enabled' : '# Normal Mode'}
    Open Browser    about:blank    ${browserName}    options=${browserOptions.join('; ')}
  `;
  
  const scriptPath = generateTempRobotScript(scriptContent);
  
  try {
    const result = await executeRobotCommand('', scriptPath);
    
    if (result.status === 'success') {
      // Store session info
      sessions.set(sessionId, {
        browser: browserName,
        options: options,
        startTime: new Date(),
        cleanup: async () => {
          try {
            await closeSession({}, sessions, sessionId);
          } catch (error) {
            console.error(`Error cleaning up session ${sessionId}:`, error);
          }
        }
      });
      
      return {
        status: 'success',
        result: {
          sessionId: sessionId,
          message: `Browser ${browserName} started successfully`
        }
      };
    } else {
      return {
        status: 'error',
        error: result.error || 'Failed to start browser'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      error: `Failed to start browser: ${error.message}`
    };
  } finally {
    // Clean up temp script file
    try {
      fs.unlinkSync(scriptPath);
    } catch (error) {
      console.error(`Error removing temp script file: ${error.message}`);
    }
  }
}

/**
 * Navigate to a URL
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function navigate(params, sessions) {
  const { url } = params;
  
  // Validate parameters
  if (!url) {
    return {
      status: 'error',
      error: 'URL parameter is required'
    };
  }
  
  // Generate Robot Framework script
  const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Navigate To URL
    Go To    ${url}
  `;
  
  const scriptPath = generateTempRobotScript(scriptContent);
  
  try {
    const result = await executeRobotCommand('', scriptPath);
    
    if (result.status === 'success') {
      return {
        status: 'success',
        result: {
          message: `Navigated to ${url}`
        }
      };
    } else {
      return {
        status: 'error',
        error: result.error || `Failed to navigate to ${url}`
      };
    }
  } catch (error) {
    return {
      status: 'error',
      error: `Failed to navigate: ${error.message}`
    };
  } finally {
    // Clean up temp script file
    try {
      fs.unlinkSync(scriptPath);
    } catch (error) {
      console.error(`Error removing temp script file: ${error.message}`);
    }
  }
}

/**
 * Close browser session
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @param {string} specificSessionId - Optional specific session ID to close
 * @returns {Promise<object>} - The tool execution result
 */
async function closeSession(params, sessions, specificSessionId) {
  // Generate Robot Framework script
  const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Close Browser Session
    Close All Browsers
  `;
  
  const scriptPath = generateTempRobotScript(scriptContent);
  
  try {
    const result = await executeRobotCommand('', scriptPath);
    
    // If a specific session was requested, remove it from the sessions map
    if (specificSessionId && sessions.has(specificSessionId)) {
      sessions.delete(specificSessionId);
    }
    
    if (result.status === 'success') {
      return {
        status: 'success',
        result: {
          message: 'Browser session closed'
        }
      };
    } else {
      return {
        status: 'error',
        error: result.error || 'Failed to close browser session'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      error: `Failed to close session: ${error.message}`
    };
  } finally {
    // Clean up temp script file
    try {
      fs.unlinkSync(scriptPath);
    } catch (error) {
      console.error(`Error removing temp script file: ${error.message}`);
    }
  }
}

/**
 * Take a screenshot
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function takeScreenshot(params, sessions) {
  const { outputPath } = params;
  const filename = outputPath || `screenshot_${Date.now()}.png`;
  
  // Generate Robot Framework script
  const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Take Screenshot
    Capture Page Screenshot    ${filename}
  `;
  
  const scriptPath = generateTempRobotScript(scriptContent);
  
  try {
    const result = await executeRobotCommand('', scriptPath);
    
    if (result.status === 'success') {
      return {
        status: 'success',
        result: {
          message: `Screenshot captured: ${filename}`
        }
      };
    } else {
      return {
        status: 'error',
        error: result.error || 'Failed to take screenshot'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      error: `Failed to take screenshot: ${error.message}`
    };
  } finally {
    // Clean up temp script file
    try {
      fs.unlinkSync(scriptPath);
    } catch (error) {
      console.error(`Error removing temp script file: ${error.message}`);
    }
  }
}

module.exports = {
  startBrowser,
  navigate,
  closeSession,
  takeScreenshot
}; 