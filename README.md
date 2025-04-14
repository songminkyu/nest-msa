> 🇺🇸 [View in Korean](docs/README.ko.md)

# NEST-MSA

This project is a Nest(NestJS)-based example that follows the Microservices Architecture (MSA), featuring the following characteristics:

- **Docker-based Development Environment**: Provides a consistent development environment using containers.
- **Database Integration**: Includes pre-configured settings for MongoDB and Redis.
- **Test Coverage**: Offers unit and integration test code based on Jest.
- **High-performance Test Execution**: Improves test speed by leveraging Jest’s parallel execution feature.
- **Layered Architecture**: Adopts a 3-Layer architecture separating concerns.
- **MSA Support**: Supports a microservice architecture based on the NATS message broker.
- **E2E Test Automation**: Builds an end-to-end test environment using Bash scripts.
- **Design Documents Included**: Contains architecture diagrams created with PlantUML.

> This project is based on the `Microservices Architecture`. If you need a `Monolithic Architecture`, please refer to the [nest-mono](https://github.com/mannercode/nest-mono) project.

## 1. System Requirements

To run this project, you need the following host environment:

- **CPU**: 4 cores or more
- **Memory**: 16GB or more recommended
    - If you have less than 16GB, it’s recommended to run Jest with the `--runInBand` option.
    - If you have many CPU cores, configure `jest.config.ts` so that `maxWorkers` is `(RAM / 4)`. (e.g., 8GB RAM → 2 workers)
- **Docker**
- **VSCode and Extensions**
    - Dev Containers (ms-vscode-remote.remote-containers)

> Using Windows may lead to compatibility issues. It’s recommended to run Ubuntu via VMware and use VSCode within that environment.

## 2. Changing the Project Name

To rename the project, edit the following files:

- `.env.test`
- `package.json`
    - `name`
- `src/apps/shared/config/etc.ts`
    - `ProjectName`

## 3. Setting up the Development Environment

### 3.1 Development Environment Setup

1. Configure [Git credentials](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials) on your host.
2. In VSCode, run the **“Reopen in Container”** command to automatically set up the environment.

### 3.2 Environment Initialization

1. In VSCode, go to **View → Command Palette** → run **Dev Containers: Rebuild Container**.

### 3.3 Language Settings

By default, this project is configured for Korean. To switch to another language, modify:

```dockerfile
# .devcontainer/Dockerfile
# for Korean
RUN apt-get install -y locales \
    && sed -i '/ko_KR.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen ko_KR.UTF-8 \
    && update-locale LANG=ko_KR.UTF-8

ENV LANG=ko_KR.UTF-8 \
    LANGUAGE=ko_KR:ko \
    LC_ALL=ko_KR.UTF-8
```

### 3.4 Configuring the Development Infrastructure

To modify development infrastructure settings, edit the following:

- `.env.infra`
    ```env
    MONGO_IMAGE=mongo:8.0
    REDIS_IMAGE=redis:7.4
    NATS_IMAGE=nats:2.10-alpine
    APP_IMAGE=node:22-alpine
    ```
- `.devcontainer/Dockerfile`
    ```dockerfile
    FROM node:22-bookworm
    ```
- `.github/workflows/test-coverage.yaml`
    ```yaml
    jobs:
        test-coverage:
            runs-on: ubuntu-24.04-arm
            container: node:22-bookworm
    ```

### 3.5 Configuring the Test Infrastructure

The test environment uses Docker-based MongoDB, Redis, and NATS, closely mirroring the production environment. Advantages include:

- **Production Environment Similarity**: Detect potential production issues early.
- **Simplicity**: Easily configure the test environment without extra libraries.

> Repetitive testing can occasionally fail due to MongoDB’s increasing memory usage. Hence, the script is set to re-initialize infrastructure before running the entire test suite.
>
> Refer to `scripts/run-test.sh` for more details.

## 4. Integration Tests and Debugging

Integration tests efficiently support MSA and TDD-based development by minimizing mocks and testing actual service combinations.

### 4.1 Running Integration Tests

1. Install the Jest Runner extension in VSCode. You will see Run | Debug buttons at the top of each test file.

    - **Run**: Executes tests (no log output)
    - **Debug**: Attaches a debugger before test execution (logs can be viewed)
    - If the buttons are not visible, enable Code Lens in your VSCode settings.

    <img src="./docs/images/jest-run-debug-button.png" alt="Jest Button" width="344"/>

2. Run `npm test` in the CLI:

    ```sh
    npm test

    > nest-msa@0.0.1 test
    > bash scripts/run-test.sh

    Select Test Suites
    > all
      apps
      common
    Enter number of runs (default 1):
    ```

### 4.2 What to Do If Tests Fail

Tests may fail depending on RAM or CPU cores. If the cause is unclear, try adjusting:

```ts
// jest.config.ts
testTimeout: 60 * 1000
maxWorkers: 1
```

> In a 32GB/8-core environment, a test that completes in under 5 seconds in a single run could exceed `testTimeout` when run in parallel.

## 5. Running and Debugging Services

Due to the microservice nature of this project, it’s typically more efficient to validate each service using integration tests rather than running them individually. However, if you need to run a specific service for debugging, refer to:

- `/.vscode/launch.json`

## 6. Build and E2E Testing

Use the following command to perform a complete build and end-to-end test:

```sh
npm run test:e2e
```

The configuration files used are:

- `./Dockerfile`
- `./docker-compose.yml`
- `./scripts/run-apps.sh`

## 7. Project Structure

Currently, the system is organized into four separate projects—`gateway`, `applications`, `cores`, and `infrastructures`—based on a small team structure (3 to 4 people). If necessary, each service can be split into an independent project for further scalability.

### 7.1 폴더 구성

```text
src
├── apps                  # Various service applications
│   ├── __tests__         # Integration tests
│   ├── applications
│   │   └── services
│   │       ├── booking             # Ticket reservation
│   │       ├── purchase-process    # Payment process
│   │       ├── recommendation      # Recommendation service
│   │       └── showtime-creation   # Creating showtimes
│   ├── cores
│   │   └── services
│   │       ├── customers         # Customer auth/management (Mock-based tests, hidden passwords, split service)
│   │       ├── movies            # Movie management (includes file uploads)
│   │       ├── purchases         # Purchase management
│   │       ├── showtimes         # Showtime management (various queries)
│   │       ├── theaters          # Theater management (index on ‘name’)
│   │       ├── ticket-holding    # Ticket holding management
│   │       ├── tickets           # Ticket management (array validation, etc.)
│   │       └── watch-records     # Viewing history management
│   ├── gateway           # REST API entry point
│   │   └── controllers
│   ├── infrastructures   # External service integrations
│   │   └── services
│   │       ├── payments         # Payment system integration
│   │       └── storage-files    # File storage integration
│   └── shared            # Shared code
│       ├── config
│       ├── modules
│       └── pipes
└── libs                  # General-purpose common libraries
    ├── common
    └── testlib
```

## 8. Design Documents

Design documents are written with PlantUML and located under ./docs/designs.
• VSCode Extension: `PlantUML(jebbs.plantuml)`
• Place the cursor between `@startuml` and `@enduml` to preview
• If necessary, adjust security settings by clicking `…` → `Change Preview Security Settings`

Example:

<img src="./docs/images/design-sample.png" alt="Document written in PlantUML" width="1061"/>

## 9. Additional Documentation

For more details on the implementation and design, see the documents below.

- Guides
    - [Design Guide](docs/en/guides/design.guide.md)
    - [Implementation Guide](docs/en/guides/implementation.guide.md)
- Designs
    - [Use Cases](docs/en/designs/use-cases.md)
    - [Entities](docs/en/designs/entities.md)
    - [Showtime Creation](docs/en/designs/showtime-creation.md)
    - [Tickets Purchase](docs/en/designs/tickets-purchase.md)
