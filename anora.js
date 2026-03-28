#!/usr/bin/env node
// ╔═══════════════════════════════════════════════════════════════╗
// ║   ANORA — Advanced Neural Operative Reasoning Agent          ║
// ║   Model  : Claude Sonnet 4.6 via OpenRouter                  ║
// ║   Runtime : Node.js                                          ║
// ║   Author  : Your ANORA build                                 ║
// ╚═══════════════════════════════════════════════════════════════╝
import readline from "readline";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Connect to Ollama
const client = new OpenAI({
  apiKey: "ollama", // ignored
  baseURL: "http://localhost:11434/v1"
});

async function run() {
  const response = await client.chat.completions.create({
    model: "anora",   // <-- your Ollama model name
    messages: [{ role: "user", content: "Hello ANORA!" }]
  });

  console.log(response.choices[0].message);
}

run();
// ── ANORA System Prompt ────────────────────────────────────────
const SYSTEM_PROMPT = `You are ANORA (Advanced Neural Operative Reasoning Agent) — a brilliant, warm, and deeply helpful AI companion that runs directly on the user's machine.

## Personality
- You are like a knowledgeable best friend who happens to be a world-class software engineer, writer, and analyst.
- You are companion-like: warm, encouraging, never condescending.
- You are proactive: you anticipate what the user needs and offer relevant suggestions.
- You are honest: you say when you're unsure rather than guessing.
- You use a natural, conversational tone — not stiff or robotic.

## Capabilities
You have four core capabilities that you can use via tool calls:
1. **chat** — Answer questions, reason, write, explain, brainstorm (default mode)
2. **read** — Read files from the user's filesystem and analyze them
3. **edit** — Write or modify files on the user's filesystem
4. **run** — Execute shell commands (with user confirmation for dangerous ops)

## Working Style (Copilot-like)
- When given a file or task, dive in immediately and provide value.
- Explain what you're doing as you do it — transparency builds trust.
- After completing a task, always offer a concrete next step.
- For code: write clean, well-commented, production-quality output.
- For edits: show what you changed and why.

## Safety
- Never run destructive commands (rm -rf, format, etc.) without explicit user confirmation.
- Warn clearly before any file edits that will overwrite content.
- Respect that you are a guest on the user's machine.

## Format
- Use markdown in responses where helpful (code blocks, bold, lists).
- Keep responses focused — don't pad with unnecessary filler.
- For long outputs, summarize first then detail.

Always greet the user warmly when a session starts. You are ANORA — proud of it, good at it.`;

// ── ANSI colours ───────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  // foregrounds
  purple: "\x1b[35m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  // bright
  bPurple: "\x1b[95m",
  bCyan: "\x1b[96m",
  bGreen: "\x1b[92m",
  bWhite: "\x1b[97m",
};

const paint = (color, text) => `${C[color]}${text}${C.reset}`;
const bold = (text) => `${C.bold}${text}${C.reset}`;

function printBanner() {
  const lines = [
    "",
    paint("bPurple", "  ╔═══════════════════════════════════════════╗"),
    paint("bPurple", "  ║") +
      paint("bCyan", "   ██████╗ ███╗  ██╗ ██████╗ ██████╗  ██████╗  ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("bCyan", "  ██╔══██╗████╗ ██║██╔═══██╗██╔══██╗██╔════╝  ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("bCyan", "  ███████║██╔██╗██║██║   ██║██████╔╝██║  ███╗ ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("bCyan", "  ██╔══██║██║╚████║██║   ██║██╔══██╗██║   ██║ ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("bCyan", "  ██║  ██║██║ ╚███║╚██████╔╝██║  ██║╚██████╔╝ ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("bCyan", "  ╚═╝  ╚═╝╚═╝  ╚══╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("gray", "      Advanced Neural Operative Reasoning Agent   ") +
      paint("bPurple", "║"),
    paint("bPurple", "  ║") +
      paint("dim", "      ANORA · Ollama Local Model · Node.js       ") +   // ← UPDATED
      paint("bPurple", "║"),
    paint("bPurple", "  ╚═══════════════════════════════════════════╝"),
    "",
  ];
  console.log(lines.join("\n"));
}
function printHelp() {
  console.log(`
${bold(paint("bPurple", "  ANORA Commands"))}
  ${paint("cyan", "/read <path>")}       Read and analyze a file
  ${paint("cyan", "/edit <path>")}       Open a file for AI-assisted editing
  ${paint("cyan", "/run <command>")}     Execute a shell command
  ${paint("cyan", "/write <path>")}      Create or overwrite a file (AI generates content)
  ${paint("cyan", "/ls [path]")}         List directory contents
  ${paint("cyan", "/pwd")}               Show current directory
  ${paint("cyan", "/cd <path>")}         Change working directory
  ${paint("cyan", "/clear")}             Clear conversation history
  ${paint("cyan", "/help")}              Show this help
  ${paint("cyan", "/exit")}              Exit ANORA
  ${paint("gray", "  Anything else is sent to ANORA as a chat message.")}
`);
}

function printANORA(text) {
  process.stdout.write(
    `\n${paint("bPurple", "  ◆ ANORA")} ${paint("gray", "·")} `
  );
  // Stream-style character output for feel
  process.stdout.write(text);
  process.stdout.write("\n\n");
}

function printSystem(text) {
  console.log(`\n  ${paint("gray", "·")} ${paint("dim", text)}`);
}

function printError(text) {
  console.log(`\n  ${paint("red", "✗")} ${paint("red", text)}\n`);
}

function printSuccess(text) {
  console.log(`\n  ${paint("bGreen", "✓")} ${paint("green", text)}\n`);
}

function printWarning(text) {
  console.log(`\n  ${paint("yellow", "⚠")} ${paint("yellow", text)}\n`);
}

function printFile(filePath, content) {
  const ext = path.extname(filePath).slice(1) || "text";
  console.log(
    `\n  ${paint("cyan", "📄")} ${paint("bCyan", filePath)} ${paint("gray", `(${ext})`)}`
  );
  console.log(paint("gray", "  " + "─".repeat(60)));
  const lines = content.split("\n");
  const preview = lines.slice(0, 50);
  preview.forEach((line, i) => {
    const num = paint("gray", String(i + 1).padStart(4, " ") + " │ ");
    console.log(`${num}${line}`);
  });
  if (lines.length > 50) {
    console.log(paint("gray", `       … ${lines.length - 50} more lines`));
  }
  console.log(paint("gray", "  " + "─".repeat(60)) + "\n");
}

// ── State ──────────────────────────────────────────────────────
let conversationHistory = [];
let cwd = process.cwd();
let sessionStart = new Date();

// ── Core: call ANORA AI (Ollama version) ───────────────────────────────
async function callANORA(userMessage, context = "") {
  const fullMessage = context
    ? `${context}\n\nUser message: ${userMessage}`
    : userMessage;

  conversationHistory.push({ role: "user", content: fullMessage });

  process.stdout.write(`\n${paint("bPurple", "  ◆ ANORA")} ${paint("gray", "·")} `);

  let fullResponse = "";

  try {
    // Ollama streaming call
    const response = await client.chat.completions.create({
      model: "anora",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory
      ],
      temperature: 0.7,
      max_tokens: 2048
    });

    // Stream chunks
    for await (const chunk of response) {
      const text = chunk.choices[0]?.delta?.content || "";
      process.stdout.write(text);
      fullResponse += text;
    }

    process.stdout.write("\n\n");

    conversationHistory.push({
      role: "assistant",
      content: fullResponse,
    });

    return fullResponse;

  } catch (err) {
    process.stdout.write("\n");
    printError(`AI error: ${err.message}`);
    conversationHistory.pop();
    return null;
  }
}

// ── Capability: READ ──────────────────────────────────────────
async function handleRead(filePath) {
  const resolved = path.resolve(cwd, filePath);
  printSystem(`Reading: ${resolved}`);

  if (!fs.existsSync(resolved)) {
    printError(`File not found: ${resolved}`);
    return;
  }

  const stat = fs.statSync(resolved);
  if (stat.isDirectory()) {
    printError(`${resolved} is a directory. Use /ls to list it.`);
    return;
  }

  const sizeKB = (stat.size / 1024).toFixed(1);
  if (stat.size > 500_000) {
    printWarning(`File is ${sizeKB} KB — large files may be truncated.`);
  }

  let content;
  try {
    content = fs.readFileSync(resolved, "utf8");
  } catch (e) {
    printError(`Cannot read file (may be binary): ${e.message}`);
    return;
  }

  printFile(resolved, content);

  // Truncate for context if needed
  const truncated = content.length > 20000 ? content.slice(0, 20000) + "\n… [truncated]" : content;

  const context = `The user wants you to read and analyze this file.

File path: ${resolved}
File size: ${sizeKB} KB
Language/type: ${path.extname(filePath).slice(1) || "text"}

File contents:
\`\`\`
${truncated}
\`\`\`

Please analyze this file: summarize what it does, highlight anything notable or potentially problematic, and offer suggestions if relevant.`;

  await callANORA("Analyze this file for me.", context);
}

// ── Capability: EDIT ──────────────────────────────────────────
async function handleEdit(filePath, rl) {
  const resolved = path.resolve(cwd, filePath);
  let existingContent = "";
  let isNew = false;

  if (!fs.existsSync(resolved)) {
    printWarning(`File doesn't exist yet. ANORA will create it.`);
    isNew = true;
  } else {
    existingContent = fs.readFileSync(resolved, "utf8");
    printFile(resolved, existingContent);
    printWarning(`This will modify the file at: ${resolved}`);
  }

  const instruction = await prompt(
    rl,
    `  ${paint("cyan", "✏")}  What should ANORA do with this file? › `
  );

  if (!instruction.trim()) {
    printSystem("Edit cancelled.");
    return;
  }

  const context = isNew
    ? `The user wants to CREATE a new file at: ${resolved}
Instruction: ${instruction}

Please write the complete file contents. After writing, explain what you created.`
    : `The user wants to EDIT this file: ${resolved}

Current contents:
\`\`\`
${existingContent.slice(0, 15000)}
\`\`\`

Instruction: ${instruction}

Please provide the COMPLETE updated file contents (not a diff — the full file), then explain what you changed and why. Format your response as:

<ANORA_FILE_START>
[complete file contents here]
<ANORA_FILE_END>

Then your explanation below.`;

  const response = await callANORA(instruction, context);
  if (!response) return;

  // Extract file content from response
  const fileMatch = response.match(
    /<ANORA_FILE_START>([\s\S]*?)<ANORA_FILE_END>/
  );

  let newContent = null;
  if (fileMatch) {
    newContent = fileMatch[1].trim();
  } else if (isNew) {
    // For new files, try to extract code blocks
    const codeMatch = response.match(/```(?:\w+)?\n([\s\S]+?)```/);
    if (codeMatch) newContent = codeMatch[1];
  }

  if (newContent) {
    const confirm = await prompt(
      rl,
      `  ${paint("yellow", "?")}  Write ${newContent.split("\n").length} lines to ${path.basename(resolved)}? [y/N] › `
    );
    if (confirm.toLowerCase() === "y") {
      // Backup existing
      if (!isNew) {
        const backup = resolved + ".anora.bak";
        fs.copyFileSync(resolved, backup);
        printSystem(`Backup saved: ${backup}`);
      }
      fs.mkdirSync(path.dirname(resolved), { recursive: true });
      fs.writeFileSync(resolved, newContent, "utf8");
      printSuccess(`File ${isNew ? "created" : "updated"}: ${resolved}`);
    } else {
      printSystem("Write cancelled — no changes made.");
    }
  } else {
    printSystem(
      "No file content detected in response. Check ANORA's reply above."
    );
  }
}

// ── Capability: WRITE (AI generates content) ──────────────────
async function handleWrite(filePath, rl) {
  const resolved = path.resolve(cwd, filePath);
  const instruction = await prompt(
    rl,
    `  ${paint("cyan", "✏")}  What should ANORA write to ${path.basename(filePath)}? › `
  );
  if (!instruction.trim()) { printSystem("Cancelled."); return; }

  const context = `The user wants you to CREATE or WRITE a file at: ${resolved}

Task: ${instruction}

Write the complete file contents. Format your response as:

<ANORA_FILE_START>
[complete file contents]
<ANORA_FILE_END>

Then give a brief explanation of what you wrote.`;

  const response = await callANORA(instruction, context);
  if (!response) return;

  const fileMatch = response.match(/<ANORA_FILE_START>([\s\S]*?)<ANORA_FILE_END>/);
  const codeMatch = response.match(/```(?:\w+)?\n([\s\S]+?)```/);
  const newContent = fileMatch ? fileMatch[1].trim() : codeMatch ? codeMatch[1] : null;

  if (newContent) {
    const confirm = await prompt(
      rl,
      `  ${paint("yellow", "?")}  Write ${newContent.split("\n").length} lines to ${path.basename(resolved)}? [y/N] › `
    );
    if (confirm.toLowerCase() === "y") {
      fs.mkdirSync(path.dirname(resolved), { recursive: true });
      fs.writeFileSync(resolved, newContent, "utf8");
      printSuccess(`File written: ${resolved}`);
    } else {
      printSystem("Write cancelled.");
    }
  }
}

// ── Capability: RUN ───────────────────────────────────────────
const DANGEROUS_PATTERNS = [
  /rm\s+-rf?\s+\//, /mkfs/, /dd\s+if=/, />\s*\/dev\/(sd|hd|nvme)/,
  /format\s+[a-z]:/i, /deltree/i, /:\(\)\{.*\}/, /fork\s*bomb/,
  /shutdown/, /reboot/, /halt/,
];

async function handleRun(command, rl) {
  const isDangerous = DANGEROUS_PATTERNS.some((p) => p.test(command));

  if (isDangerous) {
    printWarning(`⚠  This command looks potentially destructive:\n     ${command}`);
    const confirm = await prompt(
      rl,
      `  ${paint("red", "!")}  Are you SURE you want to run this? [yes/N] › `
    );
    if (confirm !== "yes") {
      printSystem("Command cancelled.");
      return;
    }
  }

  printSystem(`Running: ${command}`);
  console.log(paint("gray", "  " + "─".repeat(60)));

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd,
      timeout: 30000,
      maxBuffer: 1024 * 1024 * 5, // 5MB
    });

    if (stdout) {
      stdout.split("\n").forEach((l) =>
        console.log(`  ${paint("gray", "│")} ${l}`)
      );
    }
    if (stderr) {
      stderr.split("\n").forEach((l) =>
        console.log(`  ${paint("yellow", "│")} ${paint("yellow", l)}`)
      );
    }

    console.log(paint("gray", "  " + "─".repeat(60)));
    printSuccess("Command completed.");

    // Give ANORA context about what was run
    const output = (stdout + stderr).slice(0, 3000);
    const context = `The user just ran this command:\n\`\`\`\n${command}\n\`\`\`\n\nOutput:\n\`\`\`\n${output || "(no output)"}\n\`\`\`\n\nBriefly comment on the output — note anything important, errors, or suggestions. Be concise.`;
    await callANORA("Comment on the command output.", context);
  } catch (err) {
    console.log(paint("gray", "  " + "─".repeat(60)));
    printError(`Command failed: ${err.message}`);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.log(paint("red", err.stderr));

    const context = `The user ran:\n\`\`\`\n${command}\n\`\`\`\n\nIt failed with:\n\`\`\`\n${err.message}\n${err.stderr || ""}\n\`\`\`\n\nHelp them understand and fix this error.`;
    await callANORA("Help me fix this error.", context);
  }
}

// ── Filesystem helpers ─────────────────────────────────────────
function handleLS(dirPath = ".") {
  const resolved = path.resolve(cwd, dirPath);
  try {
    const items = fs.readdirSync(resolved, { withFileTypes: true });
    console.log(
      `\n  ${paint("cyan", "📁")} ${paint("bCyan", resolved)}\n`
    );
    items.forEach((item) => {
      const isDir = item.isDirectory();
      const icon = isDir ? "📁" : getFileIcon(item.name);
      const name = isDir
        ? paint("bCyan", item.name + "/")
        : paint("white", item.name);
      console.log(`     ${icon}  ${name}`);
    });
    console.log("");
  } catch (e) {
    printError(e.message);
  }
}

function getFileIcon(name) {
  const ext = path.extname(name).toLowerCase();
  const icons = {
    ".js": "📜", ".ts": "📘", ".py": "🐍", ".go": "🔵",
    ".rs": "🦀", ".html": "🌐", ".css": "🎨", ".json": "📋",
    ".md": "📝", ".txt": "📄", ".sh": "⚙️", ".env": "🔑",
    ".yaml": "📐", ".yml": "📐", ".sql": "🗄️", ".graphql": "🔷",
    ".png": "🖼️", ".jpg": "🖼️", ".gif": "🖼️", ".svg": "🎭",
    ".pdf": "📕", ".zip": "📦", ".log": "📃",
  };
  return icons[ext] || "📄";
}

// ── Prompt helper ──────────────────────────────────────────────
function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ── Main REPL ─────────────────────────────────────────────────
async function main() {
  printBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  rl.on("SIGINT", () => {
    console.log("\n\n" + paint("bPurple", "  ANORA") + paint("gray", " · See you! 👋\n"));
    process.exit(0);
  });

  // Boot greeting
  await callANORA(
    "Session start",
    `A new ANORA session has started.
Current directory: ${cwd}
Time: ${sessionStart.toLocaleString()}
Node.js version: ${process.version}
Platform: ${process.platform}

Greet the user warmly, briefly introduce your capabilities (chat, read files, edit files, run commands), and ask what they'd like to work on today. Keep it short and friendly — 3-4 sentences max.`
  );

  // REPL loop
  while (true) {
    const input = await prompt(
      rl,
      `${paint("bPurple", "  ›")} `
    );

    const trimmed = input.trim();
    if (!trimmed) continue;

    const [cmd, ...rest] = trimmed.split(" ");
    const args = rest.join(" ");

    switch (cmd.toLowerCase()) {
      case "/exit":
      case "/quit":
      case "/bye":
        await callANORA(
          "Session end",
          "The user is ending the session. Say a warm, brief goodbye. One sentence."
        );
        rl.close();
        process.exit(0);

      case "/help":
        printHelp();
        break;

      case "/clear":
        conversationHistory = [];
        printSuccess("Conversation history cleared.");
        break;

      case "/pwd":
        console.log(`\n  ${paint("cyan", "📍")} ${paint("bCyan", cwd)}\n`);
        break;

      case "/cd":
        if (!args) {
          printError("Usage: /cd <path>");
        } else {
          const newDir = path.resolve(cwd, args);
          if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
            cwd = newDir;
            printSuccess(`Changed to: ${cwd}`);
          } else {
            printError(`Directory not found: ${newDir}`);
          }
        }
        break;

      case "/ls":
        handleLS(args || ".");
        break;

      case "/read":
        if (!args) {
          printError("Usage: /read <file-path>");
        } else {
          await handleRead(args);
        }
        break;

      case "/edit":
        if (!args) {
          printError("Usage: /edit <file-path>");
        } else {
          await handleEdit(args, rl);
        }
        break;

      case "/write":
        if (!args) {
          printError("Usage: /write <file-path>");
        } else {
          await handleWrite(args, rl);
        }
        break;

      case "/run":
        if (!args) {
          printError("Usage: /run <shell-command>");
        } else {
          await handleRun(args, rl);
        }
        break;

      default:
        // Plain chat
        await callANORA(trimmed);
    }
  }
}

main().catch((err) => {
  printError(`Fatal: ${err.message}`);
  process.exit(1);
});
