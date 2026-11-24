import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
const text = readFileSync(entryPath, "utf8");

function fail(message) {
  console.error("invalid entry: " + message);
  process.exit(1);
}

if (text.length === 0) {
  fail("entry is empty");
}

if (text !== text.trim()) {
  fail("entry has leading or trailing whitespace");
}

if ([...text].length < 1 || [...text].length > 24) {
  fail("entry must be 1-24 characters");
}

if (/\s/.test(text)) {
  fail("entry must be exactly one word");
}

if (/[\u0000-\u001F\u007F]/.test(text)) {
  fail("entry contains a control character");
}

if (/[\u200B\u200C\u200D\uFEFF\uFFFD]/.test(text)) {
  fail("entry contains a forbidden character");
}

if (!/\p{L}/u.test(text)) {
  fail("entry must contain a letter");
}

if (!/^\p{L}+$/u.test(text)) {
  fail("entry must contain only letters (no digits, punctuation, or symbols)");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
