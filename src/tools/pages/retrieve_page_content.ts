import { getNotionClient } from "../../notion/client";
import { defineTool } from "../../utils/defineTool";

export const NOTION_RETRIEVE_PAGE_CONTENT_TOOL = defineTool((z) => ({
  name: "notion_retrieve_page_content",
  description: "Retrieve a page and all its content blocks from Notion",
  inputSchema: {
    page_id: z.string()
      .describe("The ID of the page to retrieve")
      .transform(id => id.replace(/-/g, '')), // Remove hyphens from the ID
    start_cursor: z.string().optional().describe("Cursor for pagination of blocks"),
    page_size: z.number().optional().describe("Number of blocks to return per page (max 100)"),
  },
  handler: async (input) => {
    process.stderr.write('Handler starting...\n');
    
    try {
      const client = getNotionClient();
      process.stderr.write('Got Notion client\n');
      process.stderr.write(`Using page_id: ${input.page_id}\n`);
      
      // Get both the page and its blocks in parallel
      const [page, blocks] = await Promise.all([
        client.pages.retrieve({
          page_id: input.page_id
        }),
        client.blocks.children.list({
          block_id: input.page_id,
          start_cursor: input.start_cursor,
          page_size: input.page_size
        })
      ]);
      
      process.stderr.write('Retrieved page and blocks\n');

      // Return in the format expected by MCP
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            page,
            blocks: blocks.results,
            has_more: blocks.has_more,
            next_cursor: blocks.next_cursor
          }, null, 2)
        }]
      };
    } catch (error) {
      process.stderr.write(`Error: ${error}\n`);
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