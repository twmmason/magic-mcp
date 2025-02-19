import { z } from "zod";
import { BaseTool } from "@/utils/base-tool";

const FETCH_UI_TOOL_NAME = "21st_magic_component_inspiration";
const FETCH_UI_TOOL_DESCRIPTION = `
"Use this tool when the user wants to see component, get inspiration, or /21st fetch data and previews from 21st.dev. This tool returns the JSON data of matching components without generating new code. This tool ONLY returns the text snippet for that UI component. 
After calling this tool, you must edit or add files to integrate the snippet into the codebase."
`;

interface Component {
  icon: string;
  code: string;
}

export class FetchUiTool extends BaseTool {
  name = FETCH_UI_TOOL_NAME;
  description = FETCH_UI_TOOL_DESCRIPTION;

  schema = z.object({
    searchQuery: z
      .string()
      .describe(
        "Search query for 21st.dev (library for searching UI components) to find a UI component that matches the user's message. Must be a two-four words max or phrase"
      ),
  });

  async execute({ searchQuery }: z.infer<typeof this.schema>) {
    try {
      const components: Component[] = [];

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(components, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error executing tool", error);
      throw error;
    }
  }
}
