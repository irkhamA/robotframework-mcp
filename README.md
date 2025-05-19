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
- `--help, -h`: Display help message
- `--version, -v`: Display version information

### Programmatic Usage

You can also use the package programmatically in your own Node.js projects:

```javascript
const { startServer } = require('robotframework-mcp');

// Start the MCP server on port 3000
startServer(3000);

// Now you can use MCP clients to interact with Robot Framework
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