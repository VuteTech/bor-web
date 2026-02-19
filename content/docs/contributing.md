---
title: "Contributing"
weight: 50
---

Bor is open source under the LGPL-3.0 license. Contributions are welcome.

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/VuteTech/bor.git
   cd bor
   ```

2. **Install dependencies**

   ```bash
   make install-deps
   ```

   This installs `protoc-gen-go`, `golangci-lint`, and other build tools.

3. **Start the database**

   ```bash
   make dev
   ```

4. **Run the server**

   ```bash
   make run-server
   ```

5. **Run the frontend in watch mode**

   ```bash
   cd server/web/frontend
   npm install
   npm run dev
   ```

## Project Structure

```
bor/
├── server/           # Go backend + PatternFly frontend
│   ├── cmd/server/   # Entry point
│   ├── internal/     # API, services, database, gRPC, PKI, RBAC
│   ├── pkg/grpc/     # Generated protobuf code
│   └── web/frontend/ # React + PatternFly UI
├── agent/            # Go agent daemon
│   ├── cmd/agent/    # Entry point
│   └── internal/     # Config, gRPC client, policy enforcement
├── proto/            # Protocol Buffer definitions
└── docs/             # Documentation
```

## Code Style

- **Go**: standard `gofmt` formatting. Run `make lint` before submitting.
- **Frontend**: TypeScript with React 18 and PatternFly 5. Functional components with hooks.
- **Commits**: use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.).

## Testing

```bash
make test            # All tests
make test-server     # Server tests only
make test-agent      # Agent tests only
make coverage        # HTML coverage report
```

Run a specific test:

```bash
cd server && go test -v -run TestFunctionName ./internal/services/...
```

## Pull Request Process

1. Create a feature branch from `master`.
2. Make your changes with clear, focused commits.
3. Ensure `make lint` and `make test` pass.
4. Open a pull request with a description of what changed and why.
5. Address review feedback.

## Reporting Issues

File issues on [GitHub Issues](https://github.com/VuteTech/bor/issues). Include:

- Steps to reproduce
- Expected vs. actual behavior
- Server/agent version and OS details
