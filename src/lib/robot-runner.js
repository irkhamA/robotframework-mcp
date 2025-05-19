/**
 * Robot Framework Runner
 * 
 * Executes Robot Framework commands and processes the results.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Base directory for Robot Framework scripts
const ROBOT_SCRIPTS_DIR = path.join(__dirname, '../../robot');

/**
 * Execute a Robot Framework command
 * @param {string} command - The Robot command to execute
 * @param {string} scriptPath - Path to the Robot script file
 * @returns {Promise<object>} - The execution result
 */
function executeRobotCommand(command, scriptPath) {
  return new Promise((resolve, reject) => {
    // Ensure the script exists
    if (!fs.existsSync(scriptPath)) {
      return reject(new Error(`Robot script not found: ${scriptPath}`));
    }
    
    console.log(`Executing robot command: robot ${command} ${scriptPath}`);
    
    exec(`robot ${command} ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing robot command: ${error.message}`);
        console.error(stderr);
        return reject(error);
      }
      
      // Process the output
      try {
        const result = parseRobotOutput(stdout);
        resolve(result);
      } catch (parseError) {
        console.error(`Error parsing robot output: ${parseError.message}`);
        reject(parseError);
      }
    });
  });
}

/**
 * Parse Robot Framework output
 * @param {string} output - The raw output from Robot Framework
 * @returns {object} - The parsed result
 */
function parseRobotOutput(output) {
  // This is a simplified parser and would need to be enhanced
  // based on your specific Robot Framework output format
  const lines = output.split('\n');
  const result = {
    status: 'unknown',
    output: output,
    details: {}
  };
  
  // Look for PASS/FAIL indicators
  for (const line of lines) {
    if (line.includes('PASS')) {
      result.status = 'success';
      break;
    } else if (line.includes('FAIL')) {
      result.status = 'error';
      // Try to extract the error message
      const errorMatch = /FAIL\s*(.+)/.exec(line);
      if (errorMatch) {
        result.error = errorMatch[1].trim();
      }
      break;
    }
  }
  
  return result;
}

/**
 * Generate a temporary Robot Framework script file
 * @param {string} scriptContent - The script content
 * @returns {string} - The path to the generated script file
 */
function generateTempRobotScript(scriptContent) {
  // Ensure the robot scripts directory exists
  if (!fs.existsSync(ROBOT_SCRIPTS_DIR)) {
    fs.mkdirSync(ROBOT_SCRIPTS_DIR, { recursive: true });
  }
  
  const tempFilePath = path.join(ROBOT_SCRIPTS_DIR, `temp_${Date.now()}.robot`);
  fs.writeFileSync(tempFilePath, scriptContent);
  
  return tempFilePath;
}

module.exports = {
  executeRobotCommand,
  generateTempRobotScript,
  ROBOT_SCRIPTS_DIR
}; 