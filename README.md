# streamglass

![example branch parameter](https://github.com/ggcaponetto/streamglass/actions/workflows/main.yml/badge.svg?branch=main)

Streaming layers and utilities for Twitch/OBS

The streamglass project is organized in a monorepo structure.

- [streamglass: frontend](./packages/frontend/README.md)
- [streamglass: server](./packages/server/README.md)

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
