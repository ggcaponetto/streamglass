# Stramglass: Utilities

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-97.29%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-80%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-97.29%25-brightgreen.svg?style=flat) |

Utility to concatenate mardown files.

Usage:

```bash
md-concat -i <files...> -o <output> [-s <shift>]

Options:
      --version  Show version number                                   [boolean]
  -i, --input    Input markdown files                         [array] [required]
  -o, --output   Output file path                            [string] [required]
  -s, --shift    Heading shift level                       [number] [default: 1]
      --help     Show help                                             [boolean]
```

```bash
tsx packages/sg-utilities/src/markdown-util.ts --input ./README_MONOREPO_ROOT.md ./packages/frontend/README.md ./packages/server/README.md ./packages/sg-utilities/README.md --output ./README.md
```
