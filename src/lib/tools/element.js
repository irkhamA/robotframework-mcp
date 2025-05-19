/**
 * Element Tools
 * 
 * MCP element interaction tools that map to Robot Framework SeleniumLibrary keywords.
 */

const { executeRobotCommand, generateTempRobotScript } = require('../robot-runner');
const fs = require('fs');

/**
 * Maps MCP locator strategies to Robot Framework locator strategies
 * @param {string} by - The MCP locator strategy
 * @param {string} value - The locator value
 * @returns {string} - The Robot Framework locator
 */
function mapLocator(by, value) {
  switch (by.toLowerCase()) {
    case 'id':
      return `id:${value}`;
    case 'css':
      return `css:${value}`;
    case 'xpath':
      return `xpath:${value}`;
    case 'name':
      return `name:${value}`;
    case 'tag':
      return `tag:${value}`;
    case 'class':
      return `class:${value}`;
    default:
      throw new Error(`Unsupported locator strategy: ${by}`);
  }
}

/**
 * Find an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function findElement(params, sessions) {
  const { by, value, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value) {
    return {
      status: 'error',
      error: 'Both "by" and "value" parameters are required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Find Element
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Element found: ${locator}`,
            found: true
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Element not found: ${locator}`,
          found: false
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to find element: ${error.message}`,
        found: false
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
      error: error.message,
      found: false
    };
  }
}

/**
 * Click an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function clickElement(params, sessions) {
  const { by, value, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value) {
    return {
      status: 'error',
      error: 'Both "by" and "value" parameters are required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Click Element
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    Click Element    ${locator}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Element clicked: ${locator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to click element: ${locator}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to click element: ${error.message}`
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

/**
 * Send keys to an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function sendKeys(params, sessions) {
  const { by, value, text, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value || text === undefined) {
    return {
      status: 'error',
      error: 'Parameters "by", "value", and "text" are all required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Send Keys To Element
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    Input Text    ${locator}    ${text}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Text entered into element: ${locator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to enter text into element: ${locator}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to enter text into element: ${error.message}`
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

/**
 * Get element text
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function getElementText(params, sessions) {
  const { by, value, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value) {
    return {
      status: 'error',
      error: 'Both "by" and "value" parameters are required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    // Note: This is simplified. In a real implementation, you'd need to capture
    // the text output from Robot Framework, which might require additional setup
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Get Element Text
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    ${text}=    Get Text    ${locator}
    Log    Element text: \${text}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        // In a real implementation, you would extract the actual text from the Robot Framework output
        // This is simplified and would need to be enhanced
        const textMatch = result.output.match(/Element text: (.*)/);
        const text = textMatch ? textMatch[1] : 'Text extraction not implemented';
        
        return {
          status: 'success',
          result: {
            text: text,
            message: `Got text from element: ${locator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to get text from element: ${locator}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to get text from element: ${error.message}`
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

/**
 * Hover over an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function hover(params, sessions) {
  const { by, value, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value) {
    return {
      status: 'error',
      error: 'Both "by" and "value" parameters are required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Hover Over Element
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    Mouse Over    ${locator}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Hovered over element: ${locator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to hover over element: ${locator}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to hover over element: ${error.message}`
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

/**
 * Drag and drop an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function dragAndDrop(params, sessions) {
  const { by, value, targetBy, targetValue, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value || !targetBy || !targetValue) {
    return {
      status: 'error',
      error: 'Parameters "by", "value", "targetBy", and "targetValue" are all required'
    };
  }
  
  try {
    const sourceLocator = mapLocator(by, value);
    const targetLocator = mapLocator(targetBy, targetValue);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Drag And Drop Element
    Wait Until Element Is Visible    ${sourceLocator}    ${timeout / 1000}
    Wait Until Element Is Visible    ${targetLocator}    ${timeout / 1000}
    Drag And Drop    ${sourceLocator}    ${targetLocator}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Dragged element ${sourceLocator} to ${targetLocator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to drag and drop element`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to drag and drop element: ${error.message}`
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

/**
 * Double click an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function doubleClick(params, sessions) {
  const { by, value, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value) {
    return {
      status: 'error',
      error: 'Both "by" and "value" parameters are required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Double Click Element
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    Double Click Element    ${locator}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Double-clicked element: ${locator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to double-click element: ${locator}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to double-click element: ${error.message}`
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

/**
 * Right click an element
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function rightClick(params, sessions) {
  const { by, value, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value) {
    return {
      status: 'error',
      error: 'Both "by" and "value" parameters are required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Right Click Element
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    Open Context Menu    ${locator}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `Right-clicked element: ${locator}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to right-click element: ${locator}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to right-click element: ${error.message}`
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

/**
 * Upload a file
 * @param {object} params - The tool parameters
 * @param {Map} sessions - The sessions map
 * @returns {Promise<object>} - The tool execution result
 */
async function uploadFile(params, sessions) {
  const { by, value, filePath, timeout = 10000 } = params;
  
  // Validate parameters
  if (!by || !value || !filePath) {
    return {
      status: 'error',
      error: 'Parameters "by", "value", and "filePath" are all required'
    };
  }
  
  try {
    const locator = mapLocator(by, value);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        status: 'error',
        error: `File not found: ${filePath}`
      };
    }
    
    // Generate Robot Framework script
    const scriptContent = `
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Upload File
    Wait Until Element Is Visible    ${locator}    ${timeout / 1000}
    Choose File    ${locator}    ${filePath}
    `;
    
    const scriptPath = generateTempRobotScript(scriptContent);
    
    try {
      const result = await executeRobotCommand('', scriptPath);
      
      if (result.status === 'success') {
        return {
          status: 'success',
          result: {
            message: `File uploaded successfully: ${filePath}`
          }
        };
      } else {
        return {
          status: 'error',
          error: result.error || `Failed to upload file: ${filePath}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: `Failed to upload file: ${error.message}`
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
  findElement,
  clickElement,
  sendKeys,
  getElementText,
  hover,
  dragAndDrop,
  doubleClick,
  rightClick,
  uploadFile
}; 