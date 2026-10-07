import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const TUTORIAL_DIR = path.join(ROOT, "src", "content", "tutorials");
const PROGRESS_FILE = path.join(ROOT, "content-update-progress.json");

const MODEL = process.env.OPENAI_MODEL || "gpt-6-luna";
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error("OPENAI_API_KEY GitHub secret is not configured.");
}

const allFiles = (await fs.readdir(TUTORIAL_DIR))
  .filter((name) => /^\d+-html-.*\.mdx$/.test(name))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let progress = {
  section: "html",
  total: allFiles.length,
  updated: 0,
  remaining: allFiles.length,
  completed: [],
  current: null,
  lastRun: null,
  lastStatus: "not_started",
  lastMessage: null
};

try {
  progress = JSON.parse(await fs.readFile(PROGRESS_FILE, "utf8"));
} catch {
  // First run: create progress state below.
}

progress.total = allFiles.length;
progress.completed = Array.isArray(progress.completed) ? progress.completed : [];

const nextFile = allFiles.find((file) => !progress.completed.includes(file));

if (!nextFile) {
  progress.updated = allFiles.length;
  progress.remaining = 0;
  progress.current = null;
  progress.lastRun = new Date().toISOString();
  progress.lastStatus = "complete";
  progress.lastMessage = "All HTML articles have been updated.";
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2) + "\n");
  console.log("HTML article update queue is complete.");
  process.exit(0);
}

const filePath = path.join(TUTORIAL_DIR, nextFile);
const original = await fs.readFile(filePath, "utf8");

progress.current = nextFile;
progress.lastRun = new Date().toISOString();
progress.lastStatus = "working";
progress.lastMessage = null;
await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2) + "\n");

const prompt = `
You are the senior human content editor for CodesCompiler.

Rewrite the COMPLETE Markdown/MDX article below for the HTML tutorial section.

GOAL
Make this article genuinely useful to a beginner and read like it was written by an experienced human technical writer. Do not merely paraphrase sentences. Improve explanations, flow, examples, structure, and practical value.

HUMAN-WRITING RULES
- Use natural, varied sentence lengths.
- Explain concepts in plain English before introducing jargon.
- Prefer concrete examples and practical situations.
- Avoid generic AI phrases such as "In today's digital world", "Whether you are a beginner", "Let's dive in", "In conclusion" unless genuinely useful.
- Do not stuff keywords or repeat the same point.
- Do not make every section follow an identical formula.
- Be concise where the concept is simple and more detailed where beginners commonly get confused.
- Correct technical inaccuracies.
- Do not invent browser behavior or HTML features.
- Use current HTML/WHATWG terminology where relevant.
- Do not claim HTML has a numbered "latest version"; HTML is a Living Standard.

CONTENT RULES
- Keep the article's main topic and intent.
- Improve weak/thin sections rather than deleting useful material.
- Add missing explanations when they materially help a learner.
- Include practical examples for important concepts.
- Explain what the example does and what the learner should notice.
- Where a live HTML example is useful, use the existing Editor component.
- IMPORTANT: This repository uses Astro MDX. Preserve valid MDX syntax.
- Preserve existing imports and existing site components unless there is a clear reason to improve them.
- For Editor components, keep HTML passed through initialHtmlBase64 rather than putting raw multiline HTML inside JSX props. Base64 must be valid UTF-8 Base64.
- Do not invent component names.
- Keep frontmatter valid and preserve existing metadata fields unless an improvement is clearly necessary.
- Keep internal links and existing URLs unless they are clearly wrong.
- Do not add external links just for decoration.
- Do not add fake citations or references.
- Keep FAQ content useful. If the article already has FaqItem components, preserve their structure and improve their answers when appropriate.
- For reference/lookup articles, prioritize accuracy, scanability, examples, and clear tables where useful.

EDITOR EXAMPLE RULES
When adding or improving a live example:
<Editor initialHtmlBase64="BASE64_HERE" initialJs="" activeTab="html" height="360px" />
Do not put raw \`<html>...\` markup directly inside the JSX prop.
Use the simplest example that clearly demonstrates the concept.

OUTPUT RULE
Return ONLY the complete final MDX file contents.
Do not wrap the answer in Markdown fences.
Do not add commentary before or after the MDX.

FILE: ${nextFile}

CURRENT ARTICLE:
${original}
`;

const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: MODEL,
    input: prompt,
    max_output_tokens: 20000
  })
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`OpenAI API request failed (${response.status}): ${body}`);
}

const data = await response.json();
let rewritten = data.output_text;

if (!rewritten && Array.isArray(data.output)) {
  rewritten = data.output
    .flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("");
}

if (!rewritten || rewritten.trim().length < 500) {
  throw new Error("The model returned an empty or suspiciously short article.");
}

rewritten = rewritten.trim();

if (rewritten.startsWith("```mdx")) {
  rewritten = rewritten.slice(6).trim();
  if (rewritten.endsWith("```")) rewritten = rewritten.slice(0, -3).trim();
} else if (rewritten.startsWith("```markdown")) {
  rewritten = rewritten.slice(11).trim();
  if (rewritten.endsWith("```")) rewritten = rewritten.slice(0, -3).trim();
} else if (rewritten.startsWith("```")) {
  rewritten = rewritten.slice(3).trim();
  if (rewritten.endsWith("```")) rewritten = rewritten.slice(0, -3).trim();
}

if (!rewritten.startsWith("---")) {
  throw new Error("Rewritten content does not start with valid frontmatter.");
}

await fs.writeFile(filePath, rewritten + "\n");

if (!progress.completed.includes(nextFile)) progress.completed.push(nextFile);
progress.updated = progress.completed.length;
progress.remaining = allFiles.length - progress.updated;
progress.lastStatus = "updated";
progress.lastMessage = `Prepared ${nextFile} for build validation.`;
await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2) + "\n");

console.log(`Prepared: ${nextFile}`);
console.log(`Progress: ${progress.updated}/${allFiles.length}`);
console.log(`Remaining: ${progress.remaining}`);
