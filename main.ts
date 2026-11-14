// Hands in the launch: checks LAUNCH.json against the scorer's shapes, then copies its bytes
// unchanged to the output directory (so every run writes the same bytes).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const repoDir = process.env.MAKEFUN_BOT_DIR ?? import.meta.dirname;
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
const isBase58 = (s: unknown, min: number, max: number): boolean =>
  typeof s === "string" && s.length >= min && s.length <= max && BASE58.test(s);

const bytes = readFileSync(join(repoDir, "LAUNCH.json"));
const launch = JSON.parse(bytes.toString("utf8"));
const problems: string[] = [];
if (bytes.length > 16384) problems.push("LAUNCH.json is over 16384 bytes");
if (launch === null || typeof launch !== "object" || Array.isArray(launch)) problems.push("not a JSON object");
else {
  if (!isBase58(launch.mint, 32, 44)) problems.push("mint is not a base58 address");
  const sig = launch.create_signature;
  if (!isBase58(sig, 64, 88) && !isBase58(sig, 32, 44)) problems.push("create_signature is not base58");
}
if (problems.length) {
  console.error("LAUNCH.json invalid: " + problems.join("; "));
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "LAUNCH.json"), bytes);
console.log(`mint ${launch.mint} -> ${join(outDir, "LAUNCH.json")}`);
