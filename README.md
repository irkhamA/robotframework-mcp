# Robot Framework MCP

A Model Context Protocol (MCP) server implementation for Robot Framework's SeleniumLibrary, enabling browser automation through standardized MCP clients like Claude Desktop, Goose, and others.

## Features

* Start browser sessions with Chrome and Firefox (with customizable options)
* Navigate to URLs
* Find elements using various locator strategies
* Element interactions (click, type, hover, drag and drop)
* Keyboard input handling
* Screenshot capabilities
* File uploads
* Support for headless mode

## Prerequisites

* Node.js (v14 or later)
* Robot Framework
* Robot Framework SeleniumLibrary
* Selenium WebDriver

## Installation

### Install from npm

```bash
npm install -g robotframework-mcp
```

### Or, install manually

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

### Command Line

Start the MCP server from the command line:

```bash
robotframework-mcp
```

Options:
- `--port, -p <number>`: Port to listen on (default: 3000)
- `--auto-port, -a`: Automatically find an available port if the specified one is busy
- `--help, -h`: Display help message
- `--version, -v`: Display version information

#### Troubleshooting Port Conflicts

If you see an error like `EADDRINUSE: address already in use`, it means the default port (3000) is already being used by another application. You can:

1. Specify a different port:
   ```bash
   robotframework-mcp --port 3001
   ```

2. Use the auto-port feature to automatically find an available port:
   ```bash
   robotframework-mcp --auto-port
   ```

### Programmatic Usage

You can also use the package programmatically in your own Node.js projects:

```javascript
const { startServer } = require('robotframework-mcp');

// Start the MCP server on port 3000
startServer(3000);

// Now you can use MCP clients to interact with Robot Framework
```

For handling port conflicts programmatically, you can implement your own port detection logic or catch the error and retry with a different port:

```javascript
const { startServer } = require('robotframework-mcp');

function startServerWithRetry(port, maxRetries = 5) {
  try {
    startServer(port);
    console.log(`Server started on port ${port}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE' && maxRetries > 0) {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServerWithRetry(port + 1, maxRetries - 1);
    } else {
      throw error;
    }
  }
}

startServerWithRetry(3000);
```

### Use with MCP clients

Configure your MCP client to use this server:

```json
{
  "mcpServers": {
    "robotframework": {
      "command": "npx",
      "args": ["-y", "robotframework-mcp"]
    }
  }
}
```

## Tools

The following MCP tools are supported:

### Browser Tools

- `start_browser`: Launches a browser session
- `navigate`: Navigates to a URL
- `close_session`: Closes the browser session
- `take_screenshot`: Captures a screenshot

### Element Tools

- `find_element`: Locates an element on the page
- `click_element`: Clicks an element
- `send_keys`: Types text into an input element
- `get_element_text`: Gets the text content of an element
- `hover`: Moves the mouse over an element
- `drag_and_drop`: Drags an element to another element
- `double_click`: Performs a double-click on an element
- `right_click`: Performs a right-click on an element
- `upload_file`: Uploads a file using a file input element

### Keyboard Tools

- `press_key`: Simulates pressing a keyboard key

## Architecture

This MCP server acts as a bridge between MCP clients and Robot Framework:

1. The MCP client sends a tool request to the server
2. The server translates the MCP tool request into Robot Framework commands
3. The server generates a temporary Robot Framework script
4. Robot Framework executes the script
5. The server processes the result and returns it to the MCP client

## Extending

To add new tools:

1. Create a new function in the appropriate tool file
2. Add the function to the exports in the tool file
3. Add the tool to the tools map in `src/lib/tools/index.js`

## License

MIT