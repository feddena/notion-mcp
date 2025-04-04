import { getNotionClient } from "../../notion/client";
import { defineTool } from "../../utils/defineTool";

// First, let's create a simple test tool
export const NOTION_RETRIEVE_PAGE_TOOL = defineTool((z) => ({
  name: "notion_retrieve_page",
  description: "Retrieve a page from Notion",
  inputSchema: {
    page_id: z.string(),
  },
  handler: async (input) => {
    process.stderr.write('Handler starting...\n');
    
    try {
      const client = getNotionClient();
      process.stderr.write('Got Notion client\n');
      
      const response = await client.pages.retrieve({
        page_id: input.page_id
      });
      process.stderr.write('Retrieved page\n');

      // Return in the format expected by MCP
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      process.stderr.write(`Error: ${error}\n`);
      // Return error in MCP format
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error)
          })
        }]
      };
    }
  }
}));

process.stderr.write('Tool defined\n');
