// Build data/*.csv from the PIP files in archive/ (see scripts/fetch.mjs).
//   node scripts/build.mjs        (no dependencies; Node 18+)
//
// Deterministic: same archive in, byte-identical CSVs out.
//   data/aggregates.csv       world, regional and sub-regional poverty by year and poverty line
//   data/country-surveys.csv  country poverty in each survey year, by poverty line
//
// Values are as published by PIP. Ratios are rounded to 6 decimal places and
// dollar amounts to 4; counts are unchanged.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LINES = ["3.00", "4.20", "8.30"];

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0] !== "");
  return body.map((r) => Object.fromEntries(head.map((h, j) => [h, r[j] ?? ""])));
}

const read = (name) => parseCsv(readFileSync(join(ROOT, "archive", name), "utf8"));
const isNA = (v) => v === "" || v === "NA" || v === "NaN" || v === "null";
const round = (v, dp) => (isNA(v) ? "" : String(Number(Number(v).toFixed(dp))));
const int = (v) => (isNA(v) ? "" : String(Math.round(Number(v))));
const cell = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const line = (l) => String(Number(l));

function write(name, cols, rows) {
  const out = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c] ?? "")).join(","))].join("\n") + "\n";
  writeFileSync(join(ROOT, "data", name), out);
  console.log(`data/${name}: ${rows.length} rows`);
}

// --- aggregates ---
const SUBREGIONS = new Set(["AFE", "AFW"]);
const agg = [];
for (const l of LINES) {
  for (const r of read(`pip-grp-wb-${l}.csv`)) {
    if (Math.abs(Number(r.poverty_line) - Number(l)) > 1e-9) throw new Error(`line mismatch in ${l}`);
    agg.push({
      region_code: r.region_code,
      region_name: r.region_name,
      region_type: r.region_code === "WLD" ? "world" : SUBREGIONS.has(r.region_code) ? "subregion" : "region",
      year: r.reporting_year,
      poverty_line: line(l),
      headcount_ratio: round(r.headcount, 6),
      pop_in_poverty: int(r.pop_in_poverty),
      population: int(r.reporting_pop),
      poverty_gap: round(r.poverty_gap, 6),
      mean: round(r.mean, 4),
      estimate_type: r.estimate_type,
    });
  }
}
const typeOrder = { world: 0, region: 1, subregion: 2 };
agg.sort((a, b) => typeOrder[a.region_type] - typeOrder[b.region_type] || a.region_code.localeCompare(b.region_code) || a.year - b.year || a.poverty_line - b.poverty_line);
const aggKeys = new Set(agg.map((r) => `${r.region_code}|${r.year}|${r.poverty_line}`));
if (aggKeys.size !== agg.length) throw new Error("duplicate aggregate keys");
// Regions (excluding the AFE/AFW split of Sub-Saharan Africa) must add up to the world.
for (const w of agg.filter((r) => r.region_type === "world")) {
  const sum = agg.filter((r) => r.region_type === "region" && r.year === w.year && r.poverty_line === w.poverty_line).reduce((s, r) => s + Number(r.pop_in_poverty), 0);
  if (Math.abs(sum - Number(w.pop_in_poverty)) > 1000) throw new Error(`regions do not sum to world: ${w.year} ${w.poverty_line}`);
}
write("aggregates.csv", ["region_code", "region_name", "region_type", "year", "poverty_line", "headcount_ratio", "pop_in_poverty", "population", "poverty_gap", "mean", "estimate_type"], agg);

// --- country surveys ---
const svy = [];
for (const l of LINES) {
  for (const r of read(`pip-surveys-${l}.csv`)) {
    if (r.estimation_type !== "survey") throw new Error(`non-survey row ${r.country_code} ${r.reporting_year}`);
    svy.push({
      country_code: r.country_code,
      country_name: r.country_name,
      region_code: r.region_code,
      year: r.reporting_year,
      survey_year: round(r.survey_year, 2),
      reporting_level: r.reporting_level,
      welfare_type: r.welfare_type,
      poverty_line: line(l),
      headcount_ratio: round(r.headcount, 6),
      poverty_gap: round(r.poverty_gap, 6),
      mean: round(r.mean, 4),
      median: round(r.median, 4),
      gini: round(r.gini, 6),
      population: int(r.reporting_pop),
      survey_acronym: r.survey_acronym,
      survey_coverage: r.survey_coverage,
      distribution_type: r.distribution_type,
      survey_comparability: r.survey_comparability,
    });
  }
}
svy.sort((a, b) => a.country_code.localeCompare(b.country_code) || a.year - b.year || a.reporting_level.localeCompare(b.reporting_level) || a.welfare_type.localeCompare(b.welfare_type) || a.poverty_line - b.poverty_line);
const svyKeys = new Set(svy.map((r) => `${r.country_code}|${r.year}|${r.reporting_level}|${r.welfare_type}|${r.poverty_line}`));
if (svyKeys.size !== svy.length) throw new Error("duplicate survey keys");
// Every survey must appear at all three lines.
const perLine = LINES.map((l) => svy.filter((r) => r.poverty_line === line(l)).length);
if (new Set(perLine).size !== 1) throw new Error(`survey counts differ by line: ${perLine}`);
write("country-surveys.csv", ["country_code", "country_name", "region_code", "year", "survey_year", "reporting_level", "welfare_type", "poverty_line", "headcount_ratio", "poverty_gap", "mean", "median", "gini", "population", "survey_acronym", "survey_coverage", "distribution_type", "survey_comparability"], svy);
