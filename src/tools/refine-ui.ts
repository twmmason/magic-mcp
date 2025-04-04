import { z } from "zod";
import { BaseTool } from "../utils/base-tool.js";
import { twentyFirstClient } from "../utils/http-client.js";

const REFINE_UI_TOOL_NAME = "21st_magic_component_refiner";
const REFINE_UI_TOOL_DESCRIPTION = `
"Use this tool when the user requests to refine/improve current UI component with /ui or /21 commands, 
or when context is about improving, or refining UI for a React component or molecule (NOT for big pages).
This tool improves UI of components and returns improved version of the component and instructions on how to implement it."
`;

interface RefineUiResponse {
  text: string;
}

export class RefineUiTool extends BaseTool {
  name = REFINE_UI_TOOL_NAME;
  description = REFINE_UI_TOOL_DESCRIPTION;

  schema = z.object({
    userMessage: z.string().describe("Full user's message about UI refinement"),
    absolutePathToRefiningFile: z
      .string()
      .describe("Absolute path to the file that needs to be refined"),
    context: z
      .string()
      .describe(
        "Extract the specific UI elements and aspects that need improvement based on user messages, code, and conversation history. Identify exactly which components (buttons, forms, modals, etc.) the user is referring to and what aspects (styling, layout, responsiveness, etc.) they want to enhance. Do not include generic improvements - focus only on what the user explicitly mentions or what can be reasonably inferred from the available context. If nothing specific is mentioned or you cannot determine what needs improvement, return an empty string."
      ),
  });

  async execute({
    userMessage,
    absolutePathToRefiningFile,
    context,
  }: z.infer<typeof this.schema>) {
    try {
      const { data } = await twentyFirstClient.post<RefineUiResponse>(
        "/api/refine-ui",
        {
          userMessage,
          fileContent: await this.getContentOfFile(absolutePathToRefiningFile),
          context,
        }
      );

      return {
        content: [
          {
            type: "text" as const,
            text: data.text,
          },
        ],
      };
    } catch (error) {
      console.error("Error executing tool", error);
      throw error;
    }
  }

  private async getContentOfFile(path: string): Promise<string> {
    try {
      const fs = await import("fs/promises");
      return await fs.readFile(path, "utf-8");
    } catch (error) {
      console.error(`Error reading file ${path}:`, error);
      return "";
    }
  }
}
