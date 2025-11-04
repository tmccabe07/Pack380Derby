"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
//create an mcp server
const server = new mcp_js_1.McpServer({
    name: "Sample MCP Server",
    version: "1.0.0"
});
//add an add tool
server.tool("add", { a: zod_1.z.number(), b: zod_1.z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
}));
//add a tool that finds racers by names
server.tool("find_racer", { name: zod_1.z.string().describe("The name to search for") }, async ({ name }) => {
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
                        ? `Found ${racers.length} racer(s):\n${racers.map((r) => `ID: ${r.id}, Name: ${r.name}, Rank: ${r.rank}`).join('\n')}`
                        : `No racers found matching "${name}"`
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error searching for racers: ${error instanceof Error ? error.message : 'Unknown error'}`
                }]
        };
    }
});
//add a dynamic greeting resource
server.resource("greeting", new mcp_js_1.ResourceTemplate("greeting://{name}", { list: undefined }), async (uri, { name }) => ({
    contents: [{
            uri: uri.href,
            text: `Hello, ${name}!`
        }]
}));
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport);
