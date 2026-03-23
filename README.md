# express-middleware-performance-logger

A lightweight Express middleware for logging request and response information, with configurable verbosity and built-in error logging.

---

## Installation

```bash
npm install express-middleware-performance-logger
```

---

## Usage

```typescript
import express from "express";
import { performanceLogger, errorLogger } from "express-middleware-performance-logger";

const app = express();

// Add performance logging
app.use(performanceLogger({ mode: "standard" }));

// Add error logging (place after your routes)
app.use(errorLogger);
```

---

## performanceLogger Options

| Option   | Type       | Default     | Description                              |
|----------|------------|-------------|------------------------------------------|
| `mode`   | `string`   | `"minimal"` | Controls how much information is logged  |
| `logger` | `function` | `console.log` | Custom logging function                |

### Modes

**`minimal`** — Logs the request method, URL, status code, and response time.

```
[EML] GET /api/users → 200 (12.34ms)
```

**`standard`** — Logs everything in minimal, plus path, query params, and route params.

```
[EML] Request / Response
──────────────────────────────────────────────────
  Method:        GET
  URL:           /api/users?page=1
  Path:          /api/users
  Query Params:  {"page":"1"}
  Route Params:  {}
  Status Code:   200
  Response Time: 12.34ms
──────────────────────────────────────────────────
```

**`verbose`** — Logs all request and response information, including headers, IP, cookies, and more.

### Custom Logger

By default, output is sent to `console.log`. You can pass in any logging function:

```typescript
import { performanceLogger } from "express-middleware-performance-logger";
import { myLogger } from "./logger";

app.use(performanceLogger({ mode: "standard", logger: myLogger }));
```

---

## errorLogger

Logs error details whenever an error is passed to Express's `next(err)`. Place it after your routes.

```typescript
app.use(errorLogger);
```

Output includes the timestamp, method, URL, status code, error message, and stack trace.
