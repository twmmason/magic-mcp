#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CreateUiTool } from "./tools/create-ui.js";
import { LogoSearchTool } from "./tools/logo-search.js";
import { callbackServer } from "./utils/callback-server.js";

const VERSION = "0.0.17";

const server = new McpServer({
  name: "21st-magic",
  version: VERSION,
});

// Register tools
new CreateUiTool().register(server);
new LogoSearchTool().register(server);

async function runServer() {
  const transport = new StdioServerTransport();
  console.log(`Starting server v${VERSION}...`);

  // Initialize the callback server
  try {
    await callbackServer.startServer();
    console.log("Callback server initialized");
  } catch (error) {
    console.error("Failed to initialize callback server:", error);
  }

  await server.connect(transport);
  console.log("Server started");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
