import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

//create an mcp server
const server = new McpServer({
  name: "Sample MCP Server",
  version: "1.0.0"
}); 

//add an add tool
server.tool(
    "add",
    { a: z.number(), b: z.number() },
    async ({a, b}) => ({
        content: [{ type: "text", text: String(a + b) }]
    })
);

//add a tool that finds racers by names
server.tool(
    "find_racer",
    { name: z.string().describe("The name to search for") },
    async ({ name }) => {
        try {
            const response = await fetch(`http://localhost:3000/api/racer/search?q=${encodeURIComponent(name)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const racers = await response.json();
            return {
                content: [{ 
                    type: "text", 
                    text: racers.length > 0 
                        ? `Found ${racers.length} racer(s):\n${racers.map((r: any) => `ID: ${r.id}, Name: ${r.name}, Rank: ${r.rank}`).join('\n')}`
                        : `No racers found matching "${name}"`
                }]
            };
        } catch (error) {
            return {
                content: [{ 
                    type: "text", 
                    text: `Error searching for racers: ${error instanceof Error ? error.message : 'Unknown error'}`
                }]
            };
        }
    }
);

//add a dynamic greeting resource
server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name } ) => ({
        contents: [{ 
            uri: uri.href,
            text: `Hello, ${name}!`
        }]
    })
);

const transport = new StdioServerTransport();
server.connect(transport);