// Download the World Bank Poverty and Inequality Platform (PIP) files this
// dataset is built from into archive/, unchanged.
//   node scripts/fetch.mjs        (no dependencies; Node 18+)
//
// This is a frozen snapshot: the PIP data version is pinned below, so running
// this again should give the same files (the API serves old versions). To move
// to a newer PIP release, change VERSION, fetch, rebuild and update the README.
//
// API: https://api.worldbank.org/pip/v1 (documented at https://pip.worldbank.org/api)
//   pip-grp  global and regional aggregates by year (group_by=wb)
//   pip      country survey-year estimates (fill_gaps=false: survey years only)
//   aux      reference tables (poverty lines, regions, variable dictionary)

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ARCHIVE = join(dirname(fileURLToPath(import.meta.url)), "..", "archive");
const API = "https://api.worldbank.org/pip/v1";
export const VERSION = "20260922_2021_01_02_PROD"; // September 2026 release, 2021 PPPs
const LINES = ["3.00", "4.20", "8.30"];
const HEADERS = { "User-Agent": "datasets-commons-wrangler" };

const files = [];
for (const line of LINES) {
  files.push([`pip-grp-wb-${line}.csv`, `${API}/pip-grp?country=ALL&year=all&povline=${line}&group_by=wb&version=${VERSION}&format=csv`]);
  files.push([`pip-surveys-${line}.csv`, `${API}/pip?country=ALL&year=all&povline=${line}&fill_gaps=false&version=${VERSION}&format=csv`]);
}
for (const table of ["poverty_lines", "regions", "dictionary"]) {
  files.push([`aux-${table}.csv`, `${API}/aux?table=${table}&version=${VERSION}&format=csv`]);
}

const out = { retrieved: new Date().toISOString().slice(0, 10), version: VERSION, files: [] };
for (const [name, url] of files) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 50 || buf.subarray(0, 1).toString() === "{") throw new Error(`${name}: unexpected response`);
  writeFileSync(join(ARCHIVE, name), buf);
  const sha256 = createHash("sha256").update(buf).digest("hex");
  out.files.push({ name, url, bytes: buf.length, sha256 });
  console.log(`${name}  ${buf.length} bytes  sha256 ${sha256}`);
}
writeFileSync(join(ARCHIVE, "sources.json"), JSON.stringify(out, null, 2) + "\n");
