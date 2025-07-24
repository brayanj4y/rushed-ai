import { 
  createAgent, 
  createNetwork, 
  createTool, 
  anthropic 
} from '@inngest/agent-kit';
import { z } from 'zod';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Define tools for the coding agent
const readFile = createTool({
  name: 'read_file',
  description: 'Read a file from the filesystem',
  parameters: z.object({
    path: z.string().describe('The path to the file to read'),
  }),
  handler: async ({ path }) => {
    try {
      const relativePath = path.startsWith('/') ? path.slice(1) : path;
      const content = readFileSync(relativePath, 'utf-8');
      return content;
    } catch (err) {
      console.error(`Error reading file ${path}:`, err);
      throw new Error(`Failed to read file ${path}`);
    }
  },
});

const writeFile = createTool({
  name: 'write_file',
  description: 'Write content to a file',
  parameters: z.object({
    path: z.string().describe('The path to the file to write'),
    content: z.string().describe('The content to write to the file'),
  }),
  handler: async ({ path, content }) => {
    try {
      const relativePath = path.startsWith('/') ? path.slice(1) : path;
      writeFileSync(relativePath, content);
      return 'File written successfully';
    } catch (err) {
      console.error(`Error writing file ${path}:`, err);
      throw new Error(`Failed to write file ${path}`);
    }
  },
});

const searchCode = createTool({
  name: 'search_code',
  description: 'Search for a pattern in project files',
  parameters: z.object({
    query: z.string().describe('The search query/pattern to look for'),
    directory: z.string().optional().describe('Directory to search in (defaults to current directory)'),
  }),
  handler: async ({ query, directory = '.' }) => {
    const searchFiles = (dir: string, searchQuery: string): string[] => {
      const results: string[] = [];
      const walk = (currentPath: string) => {
        try {
          const files = readdirSync(currentPath);
          for (const file of files) {
            const filePath = join(currentPath, file);
            const stat = statSync(filePath);
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
              walk(filePath);
            } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
              try {
                const content = readFileSync(filePath, 'utf-8');
                if (content.includes(searchQuery)) {
                  results.push(filePath);
                }
              } catch (err) {
                // Skip files that can't be read
              }
            }
          }
        } catch (err) {
          // Skip directories that can't be read
        }
      };
      walk(dir);
      return results;
    };

    const matches = searchFiles(directory, query);
    return matches.length === 0
      ? 'No matches found'
      : `Found matches in the following files:\n${matches.join('\n')}`;
  },
});

const executeCommand = createTool({
  name: 'execute_command',
  description: 'Execute a shell command (use with caution)',
  parameters: z.object({
    command: z.string().describe('The command to execute'),
  }),
  handler: async ({ command }) => {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(command, (error: any, stdout: string, stderr: string) => {
        if (error) {
          resolve(`Error: ${error.message}\nStderr: ${stderr}`);
        } else {
          resolve(`Stdout: ${stdout}\nStderr: ${stderr}`);
        }
      });
    });
  },
});

const saveProgress = createTool({
  name: 'save_progress',
  description: 'Save progress or results to the network state',
  parameters: z.object({
    key: z.string().describe('The key to save the data under'),
    value: z.string().describe('The value to save'),
  }),
  handler: async ({ key, value }, { network }) => {
    if (network?.state?.kv) {
      network.state.kv.set(key, value);
      return `Saved ${key} to network state`;
    }
    return 'Network state not available';
  },
});

// Create the coding agent
const codingAgent = createAgent({
  name: 'coding-agent',
  description: 'An expert coding agent that can read, write, search, and analyze code',
  system: `You are an expert coding agent with deep knowledge of TypeScript, JavaScript, and software development best practices.

Your capabilities include:
- Reading and analyzing code files
- Writing and modifying code
- Searching through codebases
- Executing commands when necessary
- Debugging and fixing issues
- Following coding standards and best practices

When working on tasks:
1. Always read relevant files first to understand the context
2. Search for patterns or similar code when needed
3. Write clean, well-documented code
4. Test your changes when possible
5. Save important progress using the save_progress tool

Be thorough in your analysis and provide clear explanations for your decisions.`,
  
  model: anthropic({
    model: 'claude-3-5-sonnet-latest',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.1, // Lower temperature for more consistent code generation
    },
  }),
  
  tools: [
    readFile,
    writeFile,
    searchCode,
    executeCommand,
    saveProgress,
  ],
});

// Create a network with the coding agent
const codingNetwork = createNetwork({
  name: 'coding-network',
  agents: [codingAgent],
  defaultModel: anthropic({
    model: 'claude-3-5-sonnet-latest',
    defaultParameters: {
      max_tokens: 4096,
      temperature: 0.1,
    },
  }),
  router: ({ network }) => {
    // Simple router that always returns the coding agent
    // You can make this more sophisticated based on your needs
    return codingAgent;
  },
});

// Export the network and agent for use
export { codingNetwork, codingAgent };

// Example usage function
export async function runCodingTask(task: string) {
  try {
    const result = await codingNetwork.run(task);
    return result;
  } catch (error) {
    console.error('Error running coding task:', error);
    throw error;
  }
}

// Example of how to use the coding agent directly
export async function runDirectCodingTask(task: string) {
  try {
    const result = await codingAgent.run(task);
    return result;
  } catch (error) {
    console.error('Error running direct coding task:', error);
    throw error;
  }
}