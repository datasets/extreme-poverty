---
retrieved: 2026-11-22
---

Provenance of the raw World Bank PIP files in this folder. They were downloaded unchanged by `scripts/fetch.mjs` (generic User-Agent `datasets-commons-wrangler`, no personal details), which also wrote `sources.json` with the same URLs, sizes and checksums.

## Source

- Publisher: World Bank, Poverty and Inequality Platform (PIP), https://pip.worldbank.org
- API: https://api.worldbank.org/pip/v1 (endpoints `pip-grp`, `pip`, `aux`; `versions` and `pip-info` list available data versions).
- Data version: `20260922_2021_01_02_PROD`, the September 2026 release in 2021 PPPs, the newest version the API listed on 22 Nov 2026 (`/versions`). PIP software at retrieval: pipapi 1.5.15, wbpip 0.1.6 (`/pip-info`).
- Release note: PIP data update of 22 September 2026, https://worldbank.github.io/PIP_data_updates/posts/2026-09-22-pip-data-update/ ("global and regional poverty estimates are reported through 2024, with model-based nowcasts extending to 2026").
- Poverty lines: `aux-poverty_lines.csv` marks $3.00 as the default line and $3.00, $4.20 and $8.30 as the visible lines.
- Line change context: World Bank Data Blog, June 2025 global poverty update, https://blogs.worldbank.org/en/opendata/june-2025-global-poverty-update-from-the-world-bank--2021-ppps-a : "The international poverty line — also called the extreme poverty line — is revised from $2.15 to $3.00." The higher lines were "revised from $3.65 to $4.20, and from $6.85 to $8.30, respectively". It reports the 2022 global extreme poverty rate rising from 9.0% to 10.5% (713 million to 838 million people) with the new PPPs, lines and data.
- Note: `aux-dictionary.csv` is served in Latin-1 (one non-UTF-8 byte); it is archived as served and not used by the build.

## Files (retrieved 2026-11-22)

| File | URL | Bytes | SHA-256 |
|---|---|---|---|
| pip-grp-wb-3.00.csv | https://api.worldbank.org/pip/v1/pip-grp?country=ALL&year=all&povline=3.00&group_by=wb&version=20260922_2021_01_02_PROD&format=csv | 90795 | edcc8dc88cc93ebf3a078940d4f64a12183231488cba6d64eb5243c5c0736f6c |
| pip-surveys-3.00.csv | https://api.worldbank.org/pip/v1/pip?country=ALL&year=all&povline=3.00&fill_gaps=false&version=20260922_2021_01_02_PROD&format=csv | 1305619 | d1147750f873731ebc157595337758de6941c102d27a3c541b9209256c0e4339 |
| pip-grp-wb-4.20.csv | https://api.worldbank.org/pip/v1/pip-grp?country=ALL&year=all&povline=4.20&group_by=wb&version=20260922_2021_01_02_PROD&format=csv | 91340 | 837f9227c43fab57d88116b3afb3af7188cb7eff6b6fe5988be388f2a0f84707 |
| pip-surveys-4.20.csv | https://api.worldbank.org/pip/v1/pip?country=ALL&year=all&povline=4.20&fill_gaps=false&version=20260922_2021_01_02_PROD&format=csv | 1315011 | fbb9f1c7cff51cffab131e63bb2fe682ab4c5321a526db72916df9021a90d2f6 |
| pip-grp-wb-8.30.csv | https://api.worldbank.org/pip/v1/pip-grp?country=ALL&year=all&povline=8.30&group_by=wb&version=20260922_2021_01_02_PROD&format=csv | 90756 | de92d7eb64cb651b5e4a7e8c24653562852f22bb1a34290ee6823f1f73bc06f3 |
| pip-surveys-8.30.csv | https://api.worldbank.org/pip/v1/pip?country=ALL&year=all&povline=8.30&fill_gaps=false&version=20260922_2021_01_02_PROD&format=csv | 1317704 | 28390480af2fbd4fea2a7b5e678c9878103c3d92696d6b7a1240588d35a73701 |
| aux-poverty_lines.csv | https://api.worldbank.org/pip/v1/aux?table=poverty_lines&version=20260922_2021_01_02_PROD&format=csv | 4483 | dff15b810a19044d3b382bf074d01dde58bfd3da229605314eee24dee602482c |
| aux-regions.csv | https://api.worldbank.org/pip/v1/aux?table=regions&version=20260922_2021_01_02_PROD&format=csv | 853 | 1884f4686aa1c3ee59b63247df3a81cf0540c1af05d89b6fc837b0abe5c0a149 |
| aux-dictionary.csv | https://api.worldbank.org/pip/v1/aux?table=dictionary&version=20260922_2021_01_02_PROD&format=csv | 7697 | 7b1ad9972b842cc9fdd4919cfe5a25828f68a545622eaf56940eb374f7a3c67b |

A second run of `fetch.mjs` the same day returned a byte-identical `pip-grp-wb-3.00.csv`.

## Licence

CC-BY-4.0 (Creative Commons Attribution 4.0 International).

Quoted verbatim from the World Bank Data Catalog dataset page "Poverty and Equity Database (Poverty and Inequality Platform)", https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform (read 22 Nov 2026):

> License: Creative Commons Attribution 4.0

> This dataset is licensed under Creative Commons Attribution 4.0

Quoted verbatim from the World Bank Data Catalog "Data Access And Licensing" page, https://datacatalog.worldbank.org/public-licenses (read 22 Nov 2026):

> The World Bank Group makes data publicly available according to open data standards and licenses datasets under the Creative Commons Attribution 4.0 International license (CC-BY 4.0).

> The Creative Commons Attribution 4.0 International license allows users to copy, modify and distribute data in any format for any purpose, including commercial use. Users are only obligated to give appropriate credit (attribution) and indicate if they have made any changes, including translations. CC-BY 4.0, with the additional terms below, is the default license for all Datasets produced by the World Bank itself and distributed as open data.

The "additional terms" on that page are a mandatory dispute-resolution procedure (mediation, then arbitration), not a restriction on use. The README credits the World Bank and PIP version and states the changes made (reshaping and rounding).
