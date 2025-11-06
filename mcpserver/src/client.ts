import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./build/index.js"]
  });

  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0"
    }
  );

  await client.connect(transport);

  // List prompts
  const prompts = await client.listPrompts();
  
  console.error("Available prompts:", prompts);

  // Get a prompt
  const prompt = await client.getPrompt({
    name: "search-for-racer",
    arguments: {
      code: "Doe"
    }
  });

  // List resources
  const resources = await client.listResources();
  console.error("Available resources:", resources);

  // Read a resource
 // const resource = await client.readResource({
   // uri: "name:Doe"
 // });

 
  const tools = await client.listTools();
  tools.tools.forEach(tool => {
            console.error(`  - ${tool.name}: ${tool.description}`);
        });

        // Test calculator operations
        console.error("\n🧮 Testing Calculator Operations:");

        // Addition
        const addResult = await client.callTool({
            name: "add",
            arguments: {
                a: 5,
                b: 3
            }
        });
        console.error(`Add 5 + 3 = ${JSON.stringify(addResult, null, 2)}`);
        
        //Test find racer
        console.error("\n🔍 Testing Racer Search Tool:");
        
        const result = await client.callTool({
            name: "find_racer",
            arguments: {
            name: "Doe"
            }
        });
        console.error(`Racer Search Result:\n${JSON.stringify(result, null, 2)}`);

}

main().catch(console.error);    