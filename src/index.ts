#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initConsoleLogger } from "mcps-logger";
initConsoleLogger();

import { config } from "./utils/config.js";

import { CreateUiTool } from "./tools/create-ui.js";
import { LogoSearchTool } from "./tools/logo-search.js";
import { FetchUiTool } from "./tools/fetch-ui";

const VERSION = "0.0.28";


const server = new McpServer({
  name: "21st-magic",
  version: VERSION,
});

// Register tools
new CreateUiTool().register(server);
new LogoSearchTool().register(server);
new FetchUiTool().register(server);

async function runServer() {
  const transport = new StdioServerTransport();
  console.log(`Starting server v${VERSION}...`);

  await server.connect(transport);
  console.log("Server started");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
