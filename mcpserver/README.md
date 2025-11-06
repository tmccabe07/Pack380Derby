##To build mcp server

in the mcpserver directory:
npm run build

##to run client
in the mcpserver directory:
npm run client

Note, make sure that derby server is already running, e.g.:
in the server directory:
npm run start:dev

##to run mcp inspector
in the mcpserver directory:
npx @modelcontextprotocol/inspector node build/index.js

in web browser, in the mcp inspector tool:
Transport Type: STDIO
command: node
Arguments: build/index.js

##notes
package.json specifies build of mcp server to be in .build/index.js
This is referenced by the client

STDIN/OUT stream is being used because this is a local experiment. 
No auth is supported by the derby server. 

Updated MCP specs call for HTTP streaming, which would be a future enhancement. 

References: 
https://github.com/microsoft/mcp-for-beginners/blob/main/03-GettingStarted/01-first-server/README.md

https://github.com/microsoft/mcp-for-beginners/blob/main/03-GettingStarted/02-client/README.md
