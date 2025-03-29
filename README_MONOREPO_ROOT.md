# StreamGlass

![example branch parameter](https://github.com/ggcaponetto/streamglass/actions/workflows/main.yml/badge.svg?branch=main)

Streaming layers and utilities for Twitch/OBS

The streamglass project is organized in a monorepo structure.

- [StreamGlass: Frontend](./packages/frontend/README.md)
- [StreamGlass: Server](./packages/server/README.md)
- [StreamGlass: Utilities](./packages/sg-utilities/README.md)
- [StreamGlass: Desktop](./packages/desktop/README.md)

## Getting Started

Install the Vercel CLI

```bash
npm i -g vercel
```

Install all dependencies

```bash
npm install --workspaces
```

### Frontend

```bash
 npm run dev --workspace=frontend
```

### Server

```bash
 npm run start --workspace=server
```

## Testing

```bash
npm run test --workspaces
```
