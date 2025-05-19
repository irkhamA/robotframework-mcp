/**
 * MCP Tools Index
 * 
 * Maps MCP tool names to their implementations and handles execution.
 */

const browserTools = require('./browser');
const elementTools = require('./element');
const keyboardTools = require('./keyboard');

// Tool mapping
const toolsMap = {
  // Browser tools
  'start_browser': browserTools.startBrowser,
  'navigate': browserTools.navigate,
  'close_session': browserTools.closeSession,
  
  // Element tools
  'find_element': elementTools.findElement,
  'click_element': elementTools.clickElement,
  'send_keys': elementTools.sendKeys,
  'get_element_text': elementTools.getElementText,
  'hover': elementTools.hover,
  'drag_and_drop': elementTools.dragAndDrop,
  'double_click': elementTools.doubleClick,
  'right_click': elementTools.rightClick,
  
  // Keyboard tools
  'press_key': keyboardTools.pressKey,
  
  // Screenshot tool
  'take_screenshot': browserTools.takeScreenshot,
  
  // Upload file tool
  'upload_file': elementTools.uploadFile
};

/**
 * Execute the requested tool
 * @param {string} tool - The tool name
 * @param {object} parameters - The tool parameters
 * @param {Map} sessions - The map of active sessions
 * @returns {Promise<object>} - The tool execution result
 */
async function executeToolRequest(tool, parameters, sessions) {
  if (!toolsMap[tool]) {
    throw new Error(`Unknown tool: ${tool}`);
  }
  
  try {
    return await toolsMap[tool](parameters, sessions);
  } catch (error) {
    console.error(`Error executing tool ${tool}:`, error);
    return {
      status: 'error',
      error: error.message
    };
  }
}

module.exports = { executeToolRequest }; 