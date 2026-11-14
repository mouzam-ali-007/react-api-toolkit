# @mouzam-ali/react-api-toolkit

A lightweight, TypeScript-first Axios client and React hooks for consistent API calls, bearer-token authentication, automatic token refresh, and standardized error handling.

[![npm version](https://img.shields.io/npm/v/@mouzam-ali/react-api-toolkit)](https://www.npmjs.com/package/@mouzam-ali/react-api-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

## Features

- Centralized Axios API client.
- Reusable React hooks.
- TypeScript support.
- Automatic Bearer token injection.
- Automatic access-token refresh after HTTP 401 responses.
- Shared token refresh for concurrent unauthorized requests.
- Standardized API error handling.
- Request cancellation with AbortController.
- Configurable base URL, timeout, and headers.
- Lightweight and tree-shakeable.

## Installation

```bash
npm install @mouzam-ali/react-api-toolkit axios
```

**Requirements:**
- React 18 or later.
- Node.js 18 or later for development/build environments.

## Quick Start

### 1. Create an API client

```ts
import { createApiClient } from "@mouzam-ali/react-api-toolkit";

export const api = createApiClient({
  baseURL: "https://api.example.com",
  timeout: 15000,
  auth: {
    getAccessToken: () => localStorage.getItem("access_token"),
  },
});
```

### 2. Fetch data using useGet

```tsx
import { useGet } from "@mouzam-ali/react-api-toolkit";

interface User {
  id: number;
  name: string;
  email: string;
}

function Users() {
  const {
    data,
    loading,
    error,
    refetch,
  } = useGet<User[]>(api, "/users");

  if (loading) return <p>Loading users...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <button onClick={() => void refetch()}>
        Refresh Users
      </button>

      {data?.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
```

## API Client Configuration

```ts
const api = createApiClient({
  baseURL: "https://api.example.com",
  timeout: 15000,
  headers: {
    "X-App-Client": "web",
  },
  auth: {
    getAccessToken: () => localStorage.getItem("access_token"),
    refreshAccessToken: async () => {
      // Return a new access token or null.
      return null;
    },
  },
});
```

### Configuration options

| Option | Description |
|---|---|
| `baseURL` | API base URL (required) |
| `timeout` | Request timeout in milliseconds |
| `headers` | Default HTTP headers |
| `auth.getAccessToken` | Returns the current access token |
| `auth.refreshAccessToken` | Refreshes an expired access token |
| `auth.attachToken` | Enables/disables automatic token attachment |
| `onRequest` | Custom request interceptor |
| `onResponse` | Successful response callback |

## React Hooks

### useApi()

Execute any API request.

```tsx
const {
  data,
  loading,
  error,
  execute,
  reset,
} = useApi<User[]>(api);

const fetchUsers = async () => {
  try {
    const users = await execute<User[]>({
      url: "/users",
      method: "GET",
    });

    console.log(users);
  } catch (error) {
    console.error(error);
  }
};
```

### useGet()

Fetch data automatically when a component mounts.

```tsx
const {
  data,
  loading,
  error,
  refetch,
} = useGet<User[]>(api, "/users");
```

Disable automatic fetching:

```tsx
const users = useGet<User[]>(api, "/users", {
  enabled: false,
});
```

### useMutation()

Handle POST, PUT, PATCH, and DELETE requests.

```tsx
import { useMutation } from "@mouzam-ali/react-api-toolkit";

interface CreateUserPayload {
  name: string;
  email: string;
}

const {
  mutate,
  loading,
  error,
} = useMutation<User, CreateUserPayload>(
  api,
  "/users"
);

const createUser = async () => {
  await mutate({
    name: "John Doe",
    email: "john@example.com",
  });
};
```

Change the HTTP method:

```tsx
const updateUser = useMutation<User, Partial<User>>(
  api,
  "/users/1",
  {
    method: "PATCH",
  }
);
```

## Authentication and Token Refresh

The toolkit supports automatic access-token injection.

```ts
const api = createApiClient({
  baseURL: "https://api.example.com",

  auth: {
    getAccessToken: () =>
      localStorage.getItem("access_token"),

    refreshAccessToken: async () => {
      const response = await fetch("/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) return null;

      const result = await response.json();

      localStorage.setItem(
        "access_token",
        result.accessToken
      );

      return result.accessToken;
    },
  },
});
```

When an API responds with HTTP 401:

1. The toolkit attempts to refresh the access token.
2. Concurrent 401 responses share one refresh operation.
3. The original request is retried with the new token.
4. If refresh fails, the request rejects with an error.

**Security note:** Token storage, refresh-token security, CSRF protection, and logout handling remain application responsibilities. Use a storage strategy appropriate to your security requirements.

## Error Handling

All hooks expose a standardized error object.

```tsx
const { data, error, loading } = useGet<User[]>(
  api,
  "/users"
);

if (error) {
  console.log(error.message);
  console.log(error.status);
  console.log(error.code);
  console.log(error.details);
}
```

The error object includes:

| Property | Description |
|---|---|
| `message` | Human-readable error |
| `status` | HTTP response status |
| `code` | Axios error code |
| `details` | Original server response data |
| `originalError` | Original error object |

## Request Cancellation

`useGet` automatically cancels its request when the URL changes or its component unmounts.

For custom requests:

```tsx
const controller = new AbortController();

execute({
  url: "/reports",
  method: "GET",
  signal: controller.signal,
});

// Cancel request
controller.abort();
```

## Available Exports

```ts
import {
  createApiClient,
  useApi,
  useGet,
  useMutation,
  normalizeApiError,
} from "@mouzam-ali/react-api-toolkit";
```

## Development

Clone the repository:

```bash
git clone https://github.com/mouzam-ali/react-api-toolkit.git

cd react-api-toolkit

npm install
```

Run development build:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Type checking:

```bash
npm run typecheck
```

Production build:

```bash
npm run build
```

## Publishing

Login to npm:

```bash
npm login
```

Verify your account:

```bash
npm whoami
```

Build and publish:

```bash
npm run build

npm publish --access public
```

## Roadmap

- [ ] Advanced caching.
- [ ] Request deduplication.
- [ ] Configurable retry policies.
- [ ] Optimistic updates.
- [ ] Offline request handling.
- [ ] React Query integration.
- [ ] More comprehensive test coverage.

## Contributing

Contributions, issues, and feature requests are welcome.

Please open an issue or submit a pull request on GitHub.

## License

MIT © 2026 Mouzam Ali

---

**Author:** Mouzam Ali  
**GitHub:** https://github.com/mouzam-ali  
**npm:** https://www.npmjs.com/~mouzam-ali