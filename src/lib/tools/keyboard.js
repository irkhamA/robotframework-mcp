/**
 * Keyboard Tools
 * 
 * MCP keyboard tools that map to Robot Framework SeleniumLibrary keyboard interactions.
 */

const { executeRobotCommand, generateTempRobotScript } = require('../robot-runner');
const fs = require('fs');

/**
 * Map of special key names
 * Maps MCP key names to Robot Framework/Selenium key names
 */
const KEY_MAPPING = {
  'enter': 'RETURN',
  'return': 'RETURN',
  'tab': 'TAB',
  'esc': 'ESCAPE',
  'escape': 'ESCAPE',
  'space': 'SPACE',
  'backspace': 'BACK_SPACE',
  'delete': 'DELETE',
  'up': 'ARROW_UP',
  'down': 'ARROW_DOWN',
  'left': 'ARROW_LEFT',
  'right': 'ARROW_RIGHT',
  'pageup': 'PAGE_UP',
  'pagedown': 'PAGE_DOWN',
  'home': 'HOME',
  'end': 'END',
  'f1': 'F1',
  'f2': 'F2',
  'f3': 'F3',
  'f4': 'F4',
  'f5': 'F5',
  'f6': 'F6',
  'f7': 'F7',
  'f8': 'F8',
  'f9': 'F9',
  'f10': 'F10',
  'f11': 'F11',
  'f12': 'F12',
  'command': 'COMMAND',
  'meta': 'COMMAND',
  'win': 'COMMAND',
  'alt': 'ALT',
  'ctrl': 'CONTROL',
  'control': 'CONTROL',
  'shift': 'SHIFT',
  'insert': 'INSERT',
  'pause': 'PAUSE',
  'capslock': 'CAPS_LOCK',
  'numlock': 'NUM_LOCK'
};

/**
 * Map a key name to Robot Framework key name
 * @param {string} key - The key name
 * @returns {string} - The Robot Framework key name
 */
function mapKey(key) {
  const lowerKey = key.toLowerCase();
  
  if (KEY_MAPPING[lowerKey]) {
    return KEY_MAPPING[lowerKey];
  }
  
  // If it's not a special key, return as is
  return key;
}

/**
 * Press a keyboard key
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function pressKey(params, sessions) {
  const { key } = params;
  
  // Validate parameters
  if (!key) {
    return {
      status: 'error',
      error: 'Key parameter is required'
    };
  }
  
  try {
    const robotKey = mapKey(key);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Press Keyboard Key
    Press Key    ${robotKey}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Key pressed: ${key}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to press key: ${key}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to press key: ${error.message}`
      };
    } finally {
      // Clean up temp script file
      try {
        fs.unlinkSync(scriptPath);
      } catch (error) {
        console.error(`Error removing temp script file: ${error.message}`);
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

module.exports = {
  pressKey
}; 