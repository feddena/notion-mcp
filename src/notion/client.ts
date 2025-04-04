import { Client } from "@notionhq/client";
import { z } from "zod";

const envSchema = z.object({
  NOTION_TOKEN: z.string().min(1, "NOTION_TOKEN is required"),
});

// Private instance
export let notionClient: Client;

export const initNotionClient = (env: z.infer<typeof envSchema>) => {
  process.stderr.write('Initializing Notion client...\n');
  try {
    const parsedEnv = envSchema.parse(env);
    
    // Create new client instance
    notionClient = new Client({
      auth: parsedEnv.NOTION_TOKEN
    });
    
    // Test if client is working
    if (!notionClient) {
      throw new Error('Failed to initialize Notion client');
    }
    
    process.stderr.write('Notion client initialized successfully\n');
  } catch (error) {
    process.stderr.write(`Error initializing Notion client: ${error}\n`);
    throw error;
  }
};

// Add a helper function to ensure client is initialized
export const getNotionClient = (): Client => {
  if (!notionClient) {
    throw new Error('Notion client not initialized. Call initNotionClient first.');
  }
  return notionClient;
};

export type NotionClient = Client;

// Add this to check if the module is loaded
console.log('Notion client module loaded');
process.stderr.write('Notion client module initialized\n');
