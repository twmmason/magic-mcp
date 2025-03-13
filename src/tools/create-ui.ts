import { z } from "zod";
import { BaseTool } from "../utils/base-tool.js";
import { twentyFirstClient } from "../utils/http-client.js";
import { readdir, readFile } from "fs/promises";

const UI_TOOL_NAME = "21st_magic_component_builder";
const UI_TOOL_DESCRIPTION = `
"Use this tool when the user requests a new UI component—e.g., mentions /ui, /21 /21st, or asks for a button, input, dialog, table, form, banner, card, or other React component.
This tool ONLY returns the text snippet for that UI component. 
After calling this tool, you must edit or add files to integrate the snippet into the codebase."
`;

interface CreateUiResponse {
  text: string;
}

export class CreateUiTool extends BaseTool {
  name = UI_TOOL_NAME;
  description = UI_TOOL_DESCRIPTION;

  schema = z.object({
    message: z.string().describe("Full users message"),
    searchQuery: z
      .string()
      .describe(
        "Generate a search query for 21st.dev (library for searching UI components) to find a UI component that matches the user's message. Must be a two-four words max or phrase"
      ),
    absolutePathToCurrentFile: z
      .string()
      .describe(
        "Absolute path to the current file to which we want to apply changes"
      ),
    absolutePathToProjectDirectory: z
      .string()
      .describe("Absolute path to the project root directory"),
  });

  async execute({
    message,
    searchQuery,
    absolutePathToProjectDirectory,
    absolutePathToCurrentFile,
  }: z.infer<typeof this.schema>) {
    try {
      const { data } = await twentyFirstClient.post<CreateUiResponse>(
        "/api/create-ui",
        {
          message,
          searchQuery,
        }
      );

      const currentDirFiles = await readdir(absolutePathToProjectDirectory, {
        withFileTypes: true,
      });

      const currentFileContent = await readFile(
        absolutePathToCurrentFile,
        "utf-8"
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              dirFiles: currentDirFiles,
              currentFileContent,
              component: data.text + "\n\n" + data.,
            }),
          },
        ],
      };
    } catch (error) {
      console.error("Error executing tool", error);
      throw error;
    }
  }
}
