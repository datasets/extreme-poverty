# Fact-check sheet: extreme-poverty

Snapshot: World Bank PIP version `20260922_2021_01_02_PROD` (September 2026 release, 2021 PPPs), retrieved 2026-11-22. Frozen.

## Claim (README "What stands out")

In 1990, 2,300,636,087 people lived below $3.00 a day (2021 PPP), and 320,618,795 of them (13.9%) were in Sub-Saharan Africa. In 2024 the world total was 824,298,368, and 580,628,061 (70.4%) were in Sub-Saharan Africa. Outside Sub-Saharan Africa the number fell 87.7% (1,980,017,292 to 243,670,307); inside it rose 81.1%, while the region's rate fell from 61.5% to 45.0%.

2024 is the latest `actual` year (2025 and 2026 are nowcasts). Both years have `estimate_type` actual for WLD and SSF.

## Numbers

- WLD 1990, line 3: pop_in_poverty 2,300,636,087; headcount_ratio 0.434144
- SSF 1990, line 3: 320,618,795; headcount_ratio 0.61502 (61.5%)
- WLD 2024, line 3: 824,298,368; headcount_ratio 0.101243 (10.1%)
- SSF 2024, line 3: 580,628,061; headcount_ratio 0.449735 (45.0%)
- SSF share: 13.94% (1990), 70.44% (2024)
- Rest of world: 1,980,017,292 (1990), 243,670,307 (2024), change -87.7%; SSF change +81.1%
- Also in README: WLD 2026 nowcast 810,946,777 (0.097938, 9.8%); 172 economies, 2,588 survey estimates, 7,764 rows in country-surveys.csv; 1,380 rows in aggregates.csv; survey years 1963 to 2025.
- From the World Bank blog (not the CSV, cited in README and PROVENANCE): 2022 global rate revised 9.0% to 10.5% (713 to 838 million); SSA 2022 rate revised 37.0% to 45.5%.

## Recompute

```sh
awk -F, 'NR>1&&$5==3&&($1=="WLD"||$1=="SSF")&&($4==1990||$4==2024){v[$1$4]=$7;r[$1$4]=$6} END{printf "WLD1990 %d SSF1990 %d (%.2f%%, rate %s)\nWLD2024 %d SSF2024 %d (%.2f%%, rate %s)\nrest %d -> %d (%.1f%%); SSF %+.1f%%\n",v["WLD1990"],v["SSF1990"],100*v["SSF1990"]/v["WLD1990"],r["SSF1990"],v["WLD2024"],v["SSF2024"],100*v["SSF2024"]/v["WLD2024"],r["SSF2024"],v["WLD1990"]-v["SSF1990"],v["WLD2024"]-v["SSF2024"],100*((v["WLD2024"]-v["SSF2024"])/(v["WLD1990"]-v["SSF1990"])-1),100*(v["SSF2024"]/v["SSF1990"]-1)}' data/aggregates.csv
```

Expected: `WLD1990 2300636087 SSF1990 320618795 (13.94%, rate 0.61502)`, `WLD2024 824298368 SSF2024 580628061 (70.44%, rate 0.449735)`, `rest 1980017292 -> 243670307 (-87.7%); SSF +81.1%`.

The awk field split is safe for these rows (WLD and SSF names have no commas); the MEA row's name is quoted and contains commas, so use a real CSV parser for other regions. Cross-check that the seven regions sum to the world: `scripts/build.mjs` fails if they differ by more than 1,000 people.

## Things to check

- PIP's API source (`pipapi`, R/utils-censor.R, `estimate_type_var`) labels censored region-years (no adequate survey coverage) as `projection` and years after the lineup year as `nowcast`.
- Licence: CC BY 4.0 per the World Bank Data Catalog page for the PIP dataset (quoted in archive/PROVENANCE.md).
