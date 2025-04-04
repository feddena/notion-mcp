import { notionClient } from "../../notion/client";
import { defineTool } from "../../utils/defineTool";

export const NOTION_LIST_COMMENTS_TOOL = defineTool((z) => ({
  name: "notion_list_comments",
  description: "List all comments for a block in Notion.",
  inputSchema: {
    block_id: z.string(),
    start_cursor: z.string().optional(),
    page_size: z.number().optional(),
  },
  handler: async (input) => {
    // Explicitly type the parameters to match the API requirements
    const params = {
      block_id: input.block_id,
      ...(input.start_cursor && { start_cursor: input.start_cursor }),
      ...(input.page_size && { page_size: input.page_size })
    };
    return await notionClient.comments.list(params);
  },
}));
