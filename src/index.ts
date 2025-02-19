import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CreateUiTool } from "@/tools/create-ui";
import { LogoSearchTool } from "@/tools/logo-search";

const server = new McpServer({
  name: "21st-magic",
  version: "0.0.1",
});

// Register tools
new CreateUiTool().register(server);
new LogoSearchTool().register(server);

const transport = new StdioServerTransport();
await server.connect(transport);
